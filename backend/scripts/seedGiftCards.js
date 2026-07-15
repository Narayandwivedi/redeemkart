require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const GiftCardListing = require('../models/GiftCardListing');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/redeemkart';

const vouchers = [
  {
    seoTitle: 'Google Play Code - ₹10 Voucher',
    description: '₹10 Google Play Gift Card at just ₹8. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 8,
    originalPrice: 10,
    stockQuantity: 10,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹50 Voucher',
    description: '₹50 Google Play Gift Card at just ₹45. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 45,
    originalPrice: 50,
    stockQuantity: 5,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹100 Voucher',
    description: '₹100 Google Play Gift Card at just ₹90. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 90,
    originalPrice: 100,
    stockQuantity: 20,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹200 Voucher',
    description: '₹200 Google Play Gift Card at just ₹150. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 150,
    originalPrice: 200,
    stockQuantity: 15,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹400 Voucher',
    description: '₹400 Google Play Gift Card at just ₹349. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 349,
    originalPrice: 400,
    stockQuantity: 10,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹520 Voucher',
    description: '₹520 Google Play Gift Card at just ₹400. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 400,
    originalPrice: 520,
    stockQuantity: 8,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  },
  {
    seoTitle: 'Google Play Code - ₹650 Voucher',
    description: '₹650 Google Play Gift Card at just ₹500. Instant digital delivery.',
    category: 'gift-cards',
    subCategory: 'digital-vouchers',
    brand: 'Google Play',
    price: 500,
    originalPrice: 650,
    stockQuantity: 0,
    images: ['/products/google%20play.avif'],
    features: ['Instant Delivery', 'Valid in India only', 'Non-refundable']
  }
];

// We need an admin user reference for GiftCardListing
const User = require('../models/User');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Finding an admin user...');
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.warn('No admin user found. Creating a temporary dummy admin object ID for listings.');
    }
    const adminId = admin ? admin._id : new mongoose.Types.ObjectId();

    console.log('Clearing existing Google Play gift cards...');
    await Product.deleteMany({ category: 'gift-cards', brand: 'Google Play' });
    // Keep existing listings, but let's delete dummy seed ones if we run it multiple times.
    await GiftCardListing.deleteMany({ brand: 'Google Play', code: { $regex: /^SEED-GP-/ } });

    console.log('Seeding products...');
    for (const v of vouchers) {
      const product = await Product.create(v);
      console.log(`Created product: ${product.seoTitle}`);

      // Seed mock codes for the stock quantity
      if (v.stockQuantity > 0) {
        const mockCodes = [];
        for (let i = 0; i < v.stockQuantity; i++) {
          mockCodes.push({
            user: adminId,
            brand: 'Google Play',
            balance: v.originalPrice, // Balance must match originalPrice!
            code: `SEED-GP-${v.originalPrice}-${Math.floor(Math.random() * 1000000)}`,
            expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
            status: 'active',
            listedBy: 'admin'
          });
        }
        await GiftCardListing.insertMany(mockCodes);
        console.log(`Created ${v.stockQuantity} mock codes for ${v.seoTitle}`);
      }
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedData();
