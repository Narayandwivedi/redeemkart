const GiftCardListing = require('../models/GiftCardListing');
const Product = require('../models/Product');

const getAllListings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const listings = await GiftCardListing.find(filter)
      .populate('user', 'fullName email')
      .populate('soldTo', 'fullName email')
      .sort({ createdAt: -1 });

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

const addListing = async (req, res) => {
  try {
    const { brand, balance, code, expiry, pin, productId } = req.body;

    if (!brand || !balance || !code) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const listing = new GiftCardListing({ 
      user: req.user._id, 
      brand, 
      balance, 
      code, 
      expiry: expiry || null, 
      pin, 
      listedBy: 'admin',
      productId: productId || null
    });
    const saved = await listing.save();

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

const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await GiftCardListing.findByIdAndDelete(id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

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

const getOrCreateProductForListing = async (listing) => {
  let product = await Product.findOne({
    brand: listing.brand,
    originalPrice: listing.balance,
    category: 'gift-cards',
    isActive: true
  });

  if (!product) {
    product = new Product({
      seoTitle: `${listing.brand} Code - ₹${listing.balance} Voucher`,
      description: `₹${listing.balance} ${listing.brand} Gift Card.`,
      category: 'gift-cards',
      subCategory: 'digital-vouchers',
      brand: listing.brand,
      originalPrice: listing.balance,
      price: listing.balance,
      stockQuantity: 0,
      maxAddCartItem: 4,
      isActive: true,
      images: [`/products/${listing.brand.toLowerCase().replace(/\s+/g, '%20')}.avif`]
    });
    await product.save();
  }

  return product;
};

const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidOn } = req.body;

    if (!['pending', 'active', 'sold', 'paid', 'expired', 'rejected', 'used'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const listing = await GiftCardListing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (status === 'active' && !listing.productId) {
      const product = await getOrCreateProductForListing(listing);
      listing.productId = product._id;
      product.stockQuantity = (product.stockQuantity || 0) + 1;
      await product.save();
    } else if (['rejected', 'used'].includes(status) && listing.status === 'active' && listing.productId) {
      const product = await Product.findById(listing.productId);
      if (product) {
        product.stockQuantity = Math.max((product.stockQuantity || 0) - 1, 0);
        await product.save();
      }
    }

    listing.status = status;
    if (status === 'active') {
      listing.soldTo = null;
    }
    if (status === 'paid') {
      listing.paidOn = paidOn ? new Date(paidOn) : new Date();
    } else if (listing.paidOn) {
      listing.paidOn = null;
    }
    await listing.save();

    res.status(200).json({
      success: true,
      message: `Listing status updated to ${status}`,
      data: listing
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const getListingsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const listings = await GiftCardListing.find({ productId })
      .populate('user', 'fullName email')
      .populate('soldTo', 'fullName email')
      .sort({ createdAt: -1 });

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

module.exports = { getAllListings, addListing, deleteListing, updateListingStatus, getListingsByProduct };
