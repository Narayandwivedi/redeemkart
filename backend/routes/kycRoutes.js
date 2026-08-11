const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { submitKyc, getMyKyc } = require('../controllers/kycController');

// Protected routes (require authentication)
router.use(protect);

router.post('/submit', submitKyc); // POST /api/kyc/submit - Submit/update KYC
router.get('/', getMyKyc);         // GET /api/kyc - Get my KYC status

module.exports = router;
