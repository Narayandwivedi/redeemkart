const express = require('express');
const router = express.Router();
const { getAllListings, addListing, deleteListing, updateListingStatus, getListingsByProduct, removeListing } = require('../controllers/adminGiftCardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getAllListings)
  .post(addListing);

router.delete('/:id', deleteListing);
router.patch('/:id/status', updateListingStatus);
router.patch('/:id/remove', removeListing);
router.get('/product/:productId', getListingsByProduct);

module.exports = router;
