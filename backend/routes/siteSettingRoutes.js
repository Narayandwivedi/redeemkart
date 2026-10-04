const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getSiteStatus, getSiteSettings, setSiteUnreachable } = require('../controllers/siteSettingController');

router.get('/status', getSiteStatus);   // GET /api/site-settings/status - storefront check

// Admin routes
router.get('/admin', protect, authorize('admin'), getSiteSettings);                   // GET /api/site-settings/admin
router.patch('/admin/unreachable', protect, authorize('admin'), setSiteUnreachable);  // PATCH /api/site-settings/admin/unreachable

module.exports = router;
