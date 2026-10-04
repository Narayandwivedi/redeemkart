const mongoose = require('mongoose');

// A normal (non-Google) signup waiting for its email OTP. The real User is only created
// once the OTP is verified, so unverified accounts never exist.
const pendingSignupSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  // Already hashed with bcrypt
  password: { type: String, required: true },
  city: { type: String, trim: true },
  district: { type: String, trim: true },
  state: { type: String, trim: true },

  // sha256 of the 6-digit OTP
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
  // Wrong OTP entries since the last OTP was sent
  attempts: { type: Number, default: 0 },
  // OTP emails sent for this signup
  sendCount: { type: Number, default: 0 },
  lastSentAt: { type: Date },

  // Removed automatically one hour after the first attempt
  createdAt: { type: Date, default: Date.now, expires: 3600 }
});

module.exports = mongoose.model('PendingSignup', pendingSignupSchema);
