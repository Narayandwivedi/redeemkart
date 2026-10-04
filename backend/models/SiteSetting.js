const mongoose = require('mongoose');

// Single-document collection holding site-wide switches
const siteSettingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'global',
      unique: true
    },
    // When true, logged-in users see a "This site can't be reached" page
    siteUnreachable: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
