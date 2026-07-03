const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information (name replaced with seoTitle)
  slug: {
    type: String,
    unique: true,
    sparse: true,  // Allow multiple null values
    required: false,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  
  // Product Classification
  category: {
    type: String,
    required: true,
    enum: ['e-commerce', 'gaming', 'food-dining', 'fashion-lifestyle', 'travel-entertainment', 'gift-cards']
  },
  subCategory: {
    type: String,
    required: true,
    enum: [
      'shopping', 'gaming-credits', 'subscription', 'food-beverage', 'clothing', 'movies-music', 'travel', 'digital-vouchers'
    ]
  },

  // Brand and Model
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  
  // Inventory Management
  sku: {
    type: String,
    required: false,
    uppercase: true
  },
  
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },

  // Physical Properties
  weight: {
    type: Number, // in grams
    min: 0
  },
  dimensions: {
    length: { type: Number, min: 0 }, // in cm
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    required: false,
    min: 0,
    default: 0
  },
  
  // Cart Quantity Limit
  maxAddCartItem: {
    type: Number,
    min: 1,
    default: 4
  },
  
  // Media
  images: [{
    type: String // Image URLs
  }],
  
  // FLEXIBLE SPECIFICATIONS - Key Feature!
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  
  // Key Features Array
  features: [{
    type: String,
    trim: true
  }],
  
  // Product Title (replaces old 'name' field)
  seoTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300  // Amazon-style detailed title
  },
  metaTitle: {
    type: String,
    maxlength: 60
  },
  metaDescription: {
    type: String,
    maxlength: 160
  },
  keywords: [{
    type: String,
    lowercase: true
  }],
  
  // Warranty Information
  warranty: {
    type: Number, // warranty period in years
    min: 0,
    default: 1
  },
  
  // Service Options (Amazon-style)
  serviceOptions: {
    freeDelivery: {
      type: Boolean,
      default: true
    },
    replacementDays: {
      type: Number, // days for replacement (e.g., 7, 10, 15, 30)
      default: 7,
      min: 0
    },
    cashOnDelivery: {
      type: Boolean,
      default: true
    },
    warrantyService: {
      type: Boolean,
      default: true
    },
    freeInstallation: {
      type: Boolean,
      default: false
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Search & Filter Optimization Fields
  searchText: {
    type: String,
    index: 'text' // Full-text search index
  },
  priceRange: {
    type: String,
    enum: ['budget', 'mid-range', 'premium', 'high-end'],
    index: true
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock',
    index: true
  }
  
}, {
  timestamps: true
});

// Compound Indexes for Fast Filtering
// productSchema.index({ category: 1, subCategory: 1 });
// productSchema.index({ brand: 1, price: 1 });
// productSchema.index({ price: 1, isActive: 1 });
// productSchema.index({ createdAt: -1, isFeatured: -1 });

// Text Search Index
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  'specifications.model': 'text',
  features: 'text'
});

// Pre-save Hook: Auto-generate fields
productSchema.pre('save', function(next) {
  // Auto-generate slug if not provided or empty
  if (!this.slug && this.seoTitle) {
    this.slug = this.seoTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .substring(0, 200); // Increased slug length for full specifications
  }
  
  // Auto-generate searchText for better search
  this.searchText = [
    this.seoTitle,
    this.brand,
    this.description,
    ...this.features,
    this.category?.replace('-', ' '),
    this.subCategory?.replace('-', ' ')
  ].join(' ').toLowerCase();
  
  // Auto-set availability based on stock
  if (this.stockQuantity > 0) {
    this.availability = 'in-stock';
  } else {
    this.availability = 'out-of-stock';
  }
  
  // Auto-set price range
  if (this.price < 500) this.priceRange = 'budget';
  else if (this.price < 2000) this.priceRange = 'mid-range';
  else if (this.price < 5000) this.priceRange = 'premium';
  else this.priceRange = 'high-end';
  
  next();
});


module.exports = mongoose.model('Product', productSchema);