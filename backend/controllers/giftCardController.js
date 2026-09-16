const GiftCardListing = require('../models/GiftCardListing');
const { notifyGiftCardListed } = require('../services/telegramService');

// Brands where first-time listers get a promotional 10% commission.
// All other brands (including Google Play) always use 30%.
const FIRST_TIMER_BRANDS = ['Amazon', 'Amazon Pay Gift Card', 'Amazon Shopping Voucher', 'Flipkart'];

const getCommissionRate = async (userId, brand) => {
  if (!FIRST_TIMER_BRANDS.includes(brand)) {
    return 30; // Google Play and all other brands: always 30%
  }
  // Check if this user has ever listed this brand before (any status counts)
  const prior = await GiftCardListing.countDocuments({ user: userId, brand });
  return prior === 0 ? 10 : 30;
};

const addListing = async (req, res) => {
  try {
    const { brand, balance, code, expiry, pin } = req.body;

    if (!brand || !balance || !code) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (brand === 'Flipkart') {
      const cleanCode = (code || '').trim().replace(/\s+/g, '');
      if (!/^\d{16}$/.test(cleanCode)) {
        return res.status(400).json({
          success: false,
          message: 'Flipkart gift card code must be exactly 16 numeric digits (e.g. 6000170522107804)'
        });
      }
      const cleanPin = (pin || '').trim().replace(/\s+/g, '');
      if (!cleanPin || !/^\d{6}$/.test(cleanPin)) {
        return res.status(400).json({
          success: false,
          message: 'Flipkart PIN is mandatory and must be exactly 6 numeric digits'
        });
      }
    }

    const commissionPercent = await getCommissionRate(req.user._id, brand);

    const listing = new GiftCardListing({
      user: req.user._id,
      brand,
      balance,
      code,
      expiry: expiry || null,
      pin,
      listedBy: 'user',
      status: 'pending',
      discountPercent: commissionPercent,
    });
    const saved = await listing.save();

    // Trigger Telegram Alert asynchronously (fire-and-forget in background)
    setImmediate(() => {
      notifyGiftCardListed({ listing: saved, user: req.user }).catch((err) => {
        console.error('[TelegramAlert] Failed to send alert for listing:', err);
      });
    });

    res.status(201).json({
      success: true,
      message: 'Gift card listed successfully',
      data: saved
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getListings = async (req, res) => {
  try {
    const listings = await GiftCardListing.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await GiftCardListing.findById(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own listings.'
      });
    }

    await GiftCardListing.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { addListing, getListings, deleteListing };
