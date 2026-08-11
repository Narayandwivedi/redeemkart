const User = require('../models/User');

const KYC_DOCUMENT_TYPES = ['aadhaar', 'pan', 'driving_license', 'passport'];

const KYC_DOCUMENT_LABELS = {
  aadhaar: 'Aadhaar',
  pan: 'PAN',
  driving_license: 'Driving Licence',
  passport: 'Passport'
};

// Lightweight format validation for each document type
const validateDocumentNumber = (type, number) => {
  const value = String(number || '').trim();
  if (!value) return 'Document number is required';

  switch (type) {
    case 'aadhaar':
      return /^\d{12}$/.test(value) ? null : 'Aadhaar number must be 12 digits';
    case 'pan':
      return /^[A-Za-z]{5}\d{4}[A-Za-z]$/.test(value)
        ? null
        : 'PAN number must be in format AAAAA0000A (5 letters, 4 digits, 1 letter)';
    case 'driving_license':
      return /^[A-Za-z0-9\- ]{6,20}$/.test(value)
        ? null
        : 'Driving licence number looks invalid';
    case 'passport':
      return /^[A-Za-z]\d{7}$/.test(value)
        ? null
        : 'Passport number must be 1 letter followed by 7 digits';
    default:
      return 'Invalid document type';
  }
};

// Mask document number for display, keep last 4 chars
const maskDocumentNumber = (type, number) => {
  const value = String(number || '');
  if (!value) return '';
  if (value.length <= 4) return '****';
  return 'XXXX' + value.slice(-4);
};

// @desc    Submit or update KYC for logged-in user
// @route   POST /api/kyc/submit
// @access  Private
const submitKyc = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Re-submission only allowed when rejected or never submitted
    if (user.kycStatus === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Your KYC is already under review'
      });
    }

    const { documentType, documentNumber, documentImage } = req.body;

    if (!KYC_DOCUMENT_TYPES.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid document type (Aadhaar, PAN, Driving Licence, or Passport)'
      });
    }

    const numberError = validateDocumentNumber(documentType, documentNumber);
    if (numberError) {
      return res.status(400).json({ success: false, message: numberError });
    }

    if (!documentImage || typeof documentImage !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo of your document'
      });
    }

    user.kycDocumentType = documentType;
    user.kycDocumentNumber = String(documentNumber).trim();
    user.kycDocumentImage = documentImage;
    user.kycStatus = 'pending';
    user.kycSubmittedAt = new Date();
    user.kycReviewedAt = undefined;
    user.kycReviewedBy = undefined;
    user.kycRejectionReason = undefined;

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.resetOtp;
    delete userObj.otpExpiresAt;

    return res.status(200).json({
      success: true,
      message: 'KYC submitted successfully. It is now pending verification.',
      user: userObj
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    return res.status(500).json({ success: false, message: 'Server error submitting KYC' });
  }
};

// @desc    Get logged-in user's KYC status
// @route   GET /api/kyc
// @access  Private
const getMyKyc = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const jwt = require('jsonwebtoken');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.userId).select('-password -resetOtp -otpExpiresAt');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        kycStatus: user.kycStatus,
        kycDocumentType: user.kycDocumentType,
        kycDocumentLabel: KYC_DOCUMENT_LABELS[user.kycDocumentType] || '',
        kycDocumentNumberMasked: maskDocumentNumber(user.kycDocumentType, user.kycDocumentNumber),
        kycDocumentImage: user.kycDocumentImage || '',
        kycSubmittedAt: user.kycSubmittedAt,
        kycReviewedAt: user.kycReviewedAt,
        kycRejectionReason: user.kycRejectionReason || ''
      }
    });
  } catch (error) {
    console.error('Get KYC error:', error);
    return res.status(500).json({ success: false, message: 'Server error fetching KYC' });
  }
};

module.exports = {
  submitKyc,
  getMyKyc,
  validateDocumentNumber,
  maskDocumentNumber,
  KYC_DOCUMENT_TYPES,
  KYC_DOCUMENT_LABELS
};
