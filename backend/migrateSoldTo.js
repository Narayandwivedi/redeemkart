require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/Order');
const GiftCardListing = require('./models/GiftCardListing');
const User = require('./models/User');

const migrateSoldTo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const orders = await Order.find({ 'giftCodes.0': { $exists: true } });
    console.log(`Found ${orders.length} orders with gift codes`);

    let updatedCount = 0;

    for (const order of orders) {
      for (const giftCode of order.giftCodes) {
        if (giftCode.listingId) {
          const listing = await GiftCardListing.findById(giftCode.listingId);
          if (listing && listing.status === 'sold' && !listing.soldTo) {
            
            let assignedUserId = null;

            if (order.userId) {
              assignedUserId = order.userId;
            } else if (order.customerInfo && order.customerInfo.email) {
              const user = await User.findOne({ email: order.customerInfo.email });
              if (user) {
                assignedUserId = user._id;
              }
            }

            if (assignedUserId) {
              listing.soldTo = assignedUserId;
              await listing.save();
              updatedCount++;
              console.log(`Updated listing ${listing.code} with user ${assignedUserId}`);
            }
          }
        }
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} listings.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateSoldTo();
