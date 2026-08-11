const User = require('../models/User');
const {
  maskDocumentNumber,
  KYC_DOCUMENT_LABELS
} = require('./kycController');

// @desc    Get all KYC submissions
// @route   GET /api/admin/kyc
// @access  Private/Admin
const getKycList = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const filter = { kycStatus: { $ne: 'not_submitted' } };

    if (req.query.status && ['pending', 'verified', 'rejected'].includes(req.query.status)) {
      filter.kycStatus = req.query.status;
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { kycDocumentNumber: searchRegex }
      ];
    }

    const users = await User.find(filter)
      .select('-password -resetOtp -otpExpiresAt')
      .sort({ kycSubmittedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    const data = users.map((user) => ({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      kycStatus: user.kycStatus,
      kycDocumentType: user.kycDocumentType,
      kycDocumentLabel: KYC_DOCUMENT_LABELS[user.kycDocumentType] || user.kycDocumentType || '',
      kycDocumentNumberMasked: maskDocumentNumber(user.kycDocumentType, user.kycDocumentNumber),
      kycDocumentImage: user.kycDocumentImage || '',
      kycSubmittedAt: user.kycSubmittedAt,
      kycReviewedAt: user.kycReviewedAt,
      kycRejectionReason: user.kycRejectionReason || ''
    }));

    return res.status(200).json({
      success: true,
      data: {
        users: data,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get KYC list error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching KYC submissions' });
  }
};

// @desc    Review (approve/reject) a KYC submission
// @route   PATCH /api/admin/kyc/:userId
// @access  Private/Admin
const reviewKyc = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action, rejectionReason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.kycStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'This KYC submission is not pending review'
      });
    }

    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'A rejection reason is required'
      });
    }

    user.kycStatus = action === 'approve' ? 'verified' : 'rejected';
    user.kycReviewedAt = new Date();
    user.kycReviewedBy = req.user ? req.user._id : undefined;
    user.kycRejectionReason = action === 'reject' ? String(rejectionReason).trim() : undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: action === 'approve' ? 'KYC approved successfully' : 'KYC rejected',
      data: {
        _id: user._id,
        kycStatus: user.kycStatus,
        kycReviewedAt: user.kycReviewedAt,
        kycRejectionReason: user.kycRejectionReason || ''
      }
    });
  } catch (error) {
    console.error('Review KYC error:', error);
    return res.status(500).json({ success: false, message: 'Server error reviewing KYC' });
  }
};

module.exports = {
  getKycList,
  reviewKyc
};
