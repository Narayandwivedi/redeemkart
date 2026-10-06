const express = require('express');
const router = express.Router();
const {
  handelUserSignup,
  verifyEmail,
  resendVerificationEmail,
  handelUserLogin,
  handleAgentLogin,
  handleUserLogout,
  generateResetPassOTP,
  submitResetPassOTP,
  isloggedin,
  isAdminLoggedIn,
  handleGoogleAuth,
  updateMobileNumber,
  updateProfile,
} = require('../controllers/authController');
const { loginLimiter } = require('../middleware/auth');

// Public authentication routes
router.post('/signup', handelUserSignup);                      // creates the account and emails a verification link
router.post('/verify-email', verifyEmail);                     // called by the page the email link opens
router.post('/resend-verification', resendVerificationEmail);  // logged-in user asks for a new link
router.post('/login', handelUserLogin);
router.post('/agent-login', loginLimiter, handleAgentLogin);    // local gift card agent: admin only, 90-day token in the body
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