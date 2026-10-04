const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SiteSetting = require('../models/SiteSetting');

const isUnreachableEnabled = async () => {
  const setting = await SiteSetting.findOne({ key: 'global' }).lean();
  return Boolean(setting && setting.siteUnreachable);
};

// @desc    Tell the storefront whether this visitor should see the "site can't be reached" page
// @route   GET /api/site-settings/status
// @access  Public (only ever true for a logged-in user)
const getSiteStatus = async (req, res) => {
  try {
    const normal = { success: true, siteUnreachable: false, pageNotFound: false };

    const token = req.cookies?.token;
    if (!token) {
      return res.status(200).json(normal);
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(200).json(normal);
    }

    const user = await User.findById(decoded.userId).select('_id show404');
    if (!user) {
      return res.status(200).json(normal);
    }

    res.status(200).json({
      success: true,
      siteUnreachable: await isUnreachableEnabled(),
      pageNotFound: Boolean(user.show404)
    });
  } catch (error) {
    console.error('Get site status error:', error);
    res.status(200).json({ success: true, siteUnreachable: false, pageNotFound: false });
  }
};

// @desc    Get site settings
// @route   GET /api/site-settings/admin
// @access  Private/Admin
const getSiteSettings = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: { siteUnreachable: await isUnreachableEnabled() } });
  } catch (error) {
    console.error('Get site settings error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching site settings' });
  }
};

// @desc    Turn the "site can't be reached" page on/off for logged-in users
// @route   PATCH /api/site-settings/admin/unreachable
// @access  Private/Admin
const setSiteUnreachable = async (req, res) => {
  try {
    if (typeof req.body.enabled !== 'boolean') {
      return res.status(400).json({ success: false, message: 'enabled must be true or false' });
    }

    const setting = await SiteSetting.findOneAndUpdate(
      { key: 'global' },
      { siteUnreachable: req.body.enabled },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({
      success: true,
      message: setting.siteUnreachable
        ? 'Logged-in users now see "This site can\'t be reached"'
        : 'Site is back to normal for logged-in users',
      data: { siteUnreachable: setting.siteUnreachable }
    });
  } catch (error) {
    console.error('Set site unreachable error:', error);
    res.status(500).json({ success: false, message: 'Server error updating site settings' });
  }
};

module.exports = {
  getSiteStatus,
  getSiteSettings,
  setSiteUnreachable
};
