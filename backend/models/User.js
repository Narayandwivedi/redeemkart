const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  fullName: {
    type: String,
    required: [true, 'full name is required'],
    trim: true,
    maxlength: [50, 'name cannot be more than 50 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId && !this.oauthProvider;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s\-\(\)]{10,15}$/, 'Please provide a valid phone number']
  },
  city: {
    type: String,
    trim: true
  },
  district: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say'],
  },

  // Payout Information
  bankAccountHolder: { type: String, trim: true },
  bankAccountNumber: { type: String, trim: true },
  bankName: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
  upiId: { type: String, trim: true },

  // KYC Information
  kycStatus: {
    type: String,
    enum: ['not_submitted', 'pending', 'verified', 'rejected'],
    default: 'not_submitted'
  },
  kycDocumentType: {
    type: String,
    enum: ['aadhaar', 'pan', 'driving_license', 'passport', ''],
    trim: true
  },
  kycDocumentNumber: { type: String, trim: true },
  kycDocumentImage: { type: String },
  kycSubmittedAt: { type: Date },
  kycReviewedAt: { type: Date },
  kycReviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  kycRejectionReason: { type: String, trim: true },

  // OAuth Information
  googleId: {
    type: String
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'facebook', 'apple', 'github']
  },
  profilePicture: {
    type: String // URL to profile picture from OAuth provider
  },

  // Address Information
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    addressLine1: {
      type: String,
      required: true,
      trim: true
    },
    addressLine2: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      default: 'India',
      trim: true
    },
    landmark: {
      type: String,
      trim: true
    }
  }],

  // Role
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  // Account Status
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: null
  },

  cart: [{
    product: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

}, {
  timestamps: true,
});




// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and exists
  if (!this.isModified('password') || !this.password) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};



// Method to add item to cart
userSchema.methods.addToCart = function(productData, quantity = 1) {
  const incomingId = productData._id || productData.id;
  
  const existingItem = this.cart.find(item => {
    const itemId = item.product._id || item.product.id;
    return String(itemId) === String(incomingId);
  });

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.cart.push({
      product: productData,
      quantity: quantity
    });
  }

  this.markModified('cart');
  return this.save();
};

// Method to remove item from cart
userSchema.methods.removeFromCart = function(productId) {
  this.cart = this.cart.filter(item => {
    const itemId = item.product._id || item.product.id;
    return String(itemId) !== String(productId);
  });
  
  this.markModified('cart');
  return this.save();
};

// Method to clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Method to add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  const exists = this.wishlist.find(item => 
    item.product.toString() === productId.toString()
  );

  if (!exists) {
    this.wishlist.push({ product: productId });
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(item => 
    item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Method to get default address
userSchema.methods.getDefaultAddress = function() {
  return this.addresses.find(address => address.isDefault) || this.addresses[0];
};

// Method to set default address
userSchema.methods.setDefaultAddress = function(addressId) {
  // Remove default from all addresses
  this.addresses.forEach(address => {
    address.isDefault = address._id.toString() === addressId.toString();
  });
  return this.save();
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('User', userSchema);
