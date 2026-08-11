const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getKycList, reviewKyc } = require('../controllers/adminKycController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

router.get('/', getKycList);            // GET /api/admin/kyc - List KYC submissions
router.patch('/:userId', reviewKyc);    // PATCH /api/admin/kyc/:userId - Approve/reject

module.exports = router;
