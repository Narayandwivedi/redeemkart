const mongoose = require('mongoose');

const giftCardListingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  balance: {
    type: Number,
    required: [true, 'Balance amount is required'],
    min: [1, 'Balance must be at least 1']
  },
  code: {
    type: String,
    required: [true, 'Gift card code is required'],
    trim: true
  },
  pin: {
    type: String,
    trim: true
  },
  expiry: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'sold', 'paid', 'expired', 'rejected', 'used'],
    default: 'active'
  },
  paidOn: {
    type: Date,
    default: null
  },
  listedBy: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('GiftCardListing', giftCardListingSchema);
