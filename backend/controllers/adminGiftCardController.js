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

const getOrCreateProductForListing = async (listing, customPrice) => {
  const sellingPrice = customPrice !== undefined && customPrice !== null
    ? Number(customPrice)
    : (listing.sellingPrice ? listing.sellingPrice : Math.round(listing.balance * 0.9));

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
      price: sellingPrice,
      stockQuantity: 0,
      maxAddCartItem: 4,
      isActive: true,
      images: [`/products/${listing.brand.toLowerCase().replace(/\s+/g, '%20')}.avif`]
    });
    await product.save();
  } else {
    // Keep product price updated with the selling rate set for this voucher
    product.price = sellingPrice;
    await product.save();
  }

  return product;
};

const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status, paidOn, sellingPrice, discountPercent } = req.body;

    const listing = await GiftCardListing.findById(id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (!status) {
      status = listing.status;
    }

    if (!['pending', 'active', 'sold', 'sold_out', 'paid', 'expired', 'rejected', 'used'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Mark as paid: if the card is not already sold/sold out, it counts as sold
    let finalStatus = status;
    if (status === 'paid') {
      finalStatus = ['sold', 'sold_out'].includes(listing.status) ? listing.status : 'sold';
    }

    // Determine custom selling price & discount percentage (default 10% discount)
    let finalSellingPrice = listing.sellingPrice;
    let finalDiscountPercent = listing.discountPercent !== undefined ? listing.discountPercent : 10;

    if (sellingPrice !== undefined && sellingPrice !== null && sellingPrice !== '') {
      finalSellingPrice = Math.max(0, Number(sellingPrice));
      finalDiscountPercent = listing.balance > 0
        ? Math.round(((listing.balance - finalSellingPrice) / listing.balance) * 100 * 10) / 10
        : 0;
    } else if (discountPercent !== undefined && discountPercent !== null && discountPercent !== '') {
      finalDiscountPercent = Number(discountPercent);
      finalSellingPrice = Math.round(listing.balance * (1 - finalDiscountPercent / 100));
    } else if (finalSellingPrice === undefined || finalSellingPrice === null) {
      // Default: 10% discount
      finalDiscountPercent = 10;
      finalSellingPrice = Math.round(listing.balance * 0.90);
    }

    listing.sellingPrice = finalSellingPrice;
    listing.discountPercent = finalDiscountPercent;

    if (finalStatus === 'active') {
      const product = await getOrCreateProductForListing(listing, finalSellingPrice);
      if (!listing.productId) {
        listing.productId = product._id;
        product.stockQuantity = (product.stockQuantity || 0) + 1;
        await product.save();
      } else if (listing.status !== 'active') {
        product.stockQuantity = (product.stockQuantity || 0) + 1;
        await product.save();
      }
    } else if (['rejected', 'used', 'sold', 'sold_out'].includes(finalStatus) && ['active', 'paid'].includes(listing.status) && listing.productId) {
      // Card is no longer available for sale - remove it from the storefront stock
      // ('paid' included for legacy cards that were paid out before stock was reduced)
      const product = await Product.findById(listing.productId);
      if (product) {
        product.stockQuantity = Math.max((product.stockQuantity || 0) - 1, 0);
        await product.save();
      }
    }

    listing.status = finalStatus;
    if (finalStatus === 'active') {
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
      message: `Listing status updated to ${finalStatus}`,
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
