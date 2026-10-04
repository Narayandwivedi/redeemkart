const express = require('express');
const router = express.Router();
const {
  handelUserSignup,
  verifySignupOtp,
  resendSignupOtp,
  handelUserLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  isAdminLoggedIn,
  handleGoogleAuth,
  updateMobileNumber,
  updateProfile,
} = require('../controllers/authController');

// Public authentication routes
router.post('/signup', handelUserSignup);               // sends the email OTP
router.post('/signup/verify', verifySignupOtp);         // creates the account once the OTP matches
router.post('/signup/resend-otp', resendSignupOtp);
router.post('/login', handelUserLogin);
router.post('/logout', handleUserLogout);

// Password reset routes
router.post('/forgot-password', generateResetPassOTP);
router.post('/reset-password', submitResetPassOTP);

// Google OAuth route
router.post('/google', handleGoogleAuth);

// Check authentication status
router.get('/me', isloggedin);
router.get('/me/admin', isAdminLoggedIn);

// Update mobile number (for Google users without phone)
router.put('/mobile', updateMobileNumber);

// Update full profile (name, phone, bank payout details)
router.put('/update-profile', updateProfile);

module.exports = router;