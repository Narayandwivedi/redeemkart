const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const GiftCardListing = require('../models/GiftCardListing');
const nodemailer = require('nodemailer');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, addressId, customerNotes, paymentMethod = 'cod', userId, recipientInfo } = req.body;

    // For logged-in users, get customer info from user data
    let customerInfo = {};
    let user = null;
    if (userId) {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      customerInfo = {
        name: user.fullName,
        email: user.email,
        phone: user.phone
      };
    } else {
      return res.status(401).json({
        success: false,
        message: 'User must be logged in to create an order'
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item is required'
      });
    }

    // Handle address - get from user's saved addresses
    let finalShippingAddress = shippingAddress;
    
    if (addressId) {
      // User is using a saved address (user is already fetched above)
      const selectedAddress = user.addresses.find(addr => addr._id.toString() === addressId);
      if (!selectedAddress) {
        return res.status(404).json({
          success: false,
          message: 'Selected address not found'
        });
      }
      
      // Convert user address to order format
      finalShippingAddress = {
        fullAddress: `${selectedAddress.addressLine1}, ${selectedAddress.addressLine2 ? selectedAddress.addressLine2 + ', ' : ''}${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postalCode}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.postalCode
      };
      
      if (!customerInfo.phone && selectedAddress.phone) {
        customerInfo.phone = selectedAddress.phone;
      }
    }
    
    // For digital products, use provided address or fall back to a placeholder
    if (!finalShippingAddress || !finalShippingAddress.fullAddress) {
      finalShippingAddress = {
        fullAddress: 'Digital Delivery',
        city: 'Digital',
        state: 'Digital',
        pincode: '000000'
      };
    }

    // Validate and process items
    let totalAmount = 0;
    let totalItems = 0;
    const processedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid productId and quantity'
        });
      }

      let subtotal = 0;
      let processedItem = null;

      if (String(item.productId).match(/^[0-9a-fA-F]{24}$/)) {
        // Fetch product details for database items
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({
            success: false,
            message: `Product with ID ${item.productId} not found`
          });
        }

        // Check stock availability
        if (product.stockQuantity < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}`
          });
        }

        subtotal = product.price * item.quantity;
        processedItem = {
          productId: product._id.toString(),
          productName: product.name || product.seoTitle,
          productBrand: product.brand || 'Unknown',
          category: product.category || 'product',
          productImage: product.images?.[0] || product.imageUrl || '',
          productPrice: product.price,
          originalPrice: product.originalPrice || product.price,
          quantity: item.quantity,
          subtotal: subtotal
        };
      } else {
        // Trust frontend data for hardcoded items (like google play vouchers)
        subtotal = (item.price || item.productPrice || 0) * item.quantity;
        processedItem = {
          productId: item.productId,
          productName: item.name || item.productName || item.productId,
          productBrand: item.brand || item.productBrand || 'Digital Goods',
          category: item.category || 'gift-cards',
          productImage: item.imageUrl || item.productImage || '',
          productPrice: item.price || item.productPrice || 0,
          originalPrice: item.originalPrice || item.price || item.productPrice || 0,
          quantity: item.quantity,
          subtotal: subtotal
        };
      }

      totalAmount += subtotal;
      totalItems += item.quantity;
      processedItems.push(processedItem);
    }

    const isDigital = finalShippingAddress.city === 'Digital';
    let estimatedDelivery;
    if (isDigital) {
      estimatedDelivery = new Date();
      estimatedDelivery.setHours(estimatedDelivery.getHours() + 24);
    }

    // Create order
    const newOrder = new Order({
      customerInfo,
      recipientInfo,
      items: processedItems,
      totalAmount,
      totalItems,
      shippingAddress: finalShippingAddress,
      customerNotes: customerNotes || '',
      paymentMethod,
      userId: userId || null,
      status: paymentMethod === 'online' ? 'pending' : 'confirmed',
      paymentStatus: 'pending',
      ...(estimatedDelivery && { estimatedDelivery })
    });

    const savedOrder = await newOrder.save();

    // Update product stock quantities
    for (const item of processedItems) {
      if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: -item.quantity } },
          { new: true }
        );
      }
    }

    let razorpayOrder = null;
    if (paymentMethod === 'online') {
      const amountInPaise = Math.round(totalAmount * 100);
      if (amountInPaise < 100) {
        // Restore stock
        for (const item of processedItems) {
          if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
            await Product.findByIdAndUpdate(
              item.productId,
              { $inc: { stockQuantity: item.quantity } }
            );
          }
        }
        await Order.findByIdAndDelete(savedOrder._id);
        return res.status(400).json({
          success: false,
          message: 'Amount must be at least ₹1 (100 paise)'
        });
      }

      try {
        razorpayOrder = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: savedOrder._id.toString()
        });
        savedOrder.razorpayOrderId = razorpayOrder.id;
        await savedOrder.save();
      } catch (rzpErr) {
        console.error('Razorpay order creation error:', rzpErr);
        // Restore stock
        for (const item of processedItems) {
          if (item.productId.match(/^[0-9a-fA-F]{24}$/)) {
            await Product.findByIdAndUpdate(
              item.productId,
              { $inc: { stockQuantity: item.quantity } }
            );
          }
        }
        await Order.findByIdAndDelete(savedOrder._id);
        return res.status(500).json({
          success: false,
          message: 'Failed to initiate online payment with Razorpay',
          error: rzpErr.message
        });
      }
    }



    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: savedOrder._id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        estimatedDelivery: savedOrder.estimatedDelivery,
        razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
        razorpayKeyId: razorpayOrder ? process.env.RAZORPAY_KEY_ID : null
      }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get order by ID
const getOrder = async (req, res) => {
  try {
    const { identifier, orderId } = req.params; // Order ID - can come from either parameter
    const id = identifier || orderId;

    let order;

    // Check if id is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format'
      });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// Get orders by customer email
const getOrdersByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const orders = await Order.find({ 'customerInfo.email': email })
      .sort({ orderDate: -1 });

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders by email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'delivered'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
      });
    }

    const updateData = { status };
    if (adminNotes) {
      updateData.adminNotes = adminNotes;
    }
    if (status === 'delivered') {
      updateData.deliveryDate = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      startDate, 
      endDate,
      sortBy = 'orderDate',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) {
        query.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.orderDate.$lte = new Date(endDate);
      }
    }

    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortDirection };

    const orders = await Order.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};



// Verify payment signature
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for signature verification'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      order.razorpayPaymentId = razorpay_payment_id;
      order.razorpaySignature = razorpay_signature;

      // Assign gift card redeem codes for digital gift card items
      // Assign gift card redeem codes for digital gift card items
      const giftCodes = [];
      let totalRequiredCodes = 0;

      for (const item of order.items) {
        // Detect gift card items by checking the category
        if (item.category === 'gift-cards' || (!String(item.productId).match(/^[0-9a-fA-F]{24}$/))) {
          totalRequiredCodes += item.quantity;
          
          let balance = parseFloat(item.originalPrice || item.productPrice);
          let brandName = item.productBrand;

          // Legacy fallback for old hardcoded item format (e.g. 'google-play-10')
          if (!String(item.productId).match(/^[0-9a-fA-F]{24}$/) && (!balance || brandName === 'Digital Goods')) {
            const parts = item.productId.split('-');
            balance = parseFloat(parts[parts.length - 1]);
            const brandSlug = parts.slice(0, parts.length - 1).join(' ');
            brandName = brandSlug
              .split(' ')
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');
          }

          // Loop for the quantity purchased of this specific item
          for (let q = 0; q < item.quantity; q++) {
            // Find an available admin-listed gift card - prefer matching by productId for precision
            let availableListing = null;
            if (String(item.productId).match(/^[0-9a-fA-F]{24}$/)) {
              // Match by exact product ID first
              availableListing = await GiftCardListing.findOne({
                productId: item.productId,
                status: 'active',
                listedBy: 'admin'
              });
            }
            // Fallback: match by brand + balance (handles old orders & user-listed codes)
            if (!availableListing) {
              availableListing = await GiftCardListing.findOne({
                brand: brandName,
                balance: balance,
                status: 'active',
                listedBy: 'admin'
              });
            }

            if (availableListing) {
              // Mark as sold
              availableListing.status = 'sold';
              if (order.userId) {
                availableListing.soldTo = order.userId;
              } else if (order.customerInfo && order.customerInfo.email) {
                // If guest checkout, try to find user by email
                const userByEmail = await User.findOne({ email: order.customerInfo.email });
                if (userByEmail) {
                  availableListing.soldTo = userByEmail._id;
                }
              }
              await availableListing.save();

              giftCodes.push({
                productId: item.productId,
                brand: availableListing.brand,
                code: availableListing.code,
                pin: availableListing.pin || null,
                balance: availableListing.balance,
                listingId: availableListing._id
              });
            }
            // If no code found for this iteration, we do NOT fail. We just don't add to giftCodes.
          }
        }
      }

      if (giftCodes.length > 0) {
        order.giftCodes = giftCodes;
      }

      if (totalRequiredCodes > 0) {
        // If all required gift card codes have been assigned, mark as delivered
        if (giftCodes.length >= totalRequiredCodes) {
          order.status = 'delivered';
          order.deliveryDate = new Date();
        } else {
          // Some or all codes are missing - mark as pending delivery
          order.status = 'pending';
          console.log(`Order ${order._id} requires ${totalRequiredCodes} codes but only ${giftCodes.length} found. Marked as pending.`);
        }
      }

      await order.save();

      // Send Email with beautiful template
      if (giftCodes.length > 0) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const recipientEmail = (order.recipientInfo && order.recipientInfo.email) ? order.recipientInfo.email : order.customerInfo.email;
          const recipientName = (order.recipientInfo && order.recipientInfo.name) ? order.recipientInfo.name : order.customerInfo.name;
          const logoUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/favicon.png` : 'https://redeemkart.in/favicon.png';

          let codesHtml = '';
          for (const code of giftCodes) {
            codesHtml += `
              <div style="margin-bottom: 24px; padding: 20px; border-radius: 12px; background: #fffbeb; border: 1px solid #fde68a;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #92400e;">${code.brand} - Balance: ₹${code.balance}</p>
                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px dashed #d97706; text-align: center; margin-bottom: 12px;">
                  <p style="margin: 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #000000; letter-spacing: 2px; user-select: all;">${code.code}</p>
                </div>
                ${code.pin ? `<p style="margin: 0; font-size: 14px; color: #b45309; text-align: center;">PIN: <strong>${code.pin}</strong></p>` : ''}
              </div>
            `;
          }

          const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155;">
              <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                <div style="background: linear-gradient(to right, #fbbf24, #f59e0b); padding: 30px 20px; text-align: center;">
                  <img src="${logoUrl}" alt="RedeemKart Logo" style="width: 64px; height: 64px; border-radius: 12px; margin-bottom: 16px; border: 2px solid #ffffff;" />
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Your Digital Vouchers</h1>
                </div>
                
                <div style="padding: 32px 24px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">Hello <strong>${recipientName}</strong>,</p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">Thank you for your purchase from RedeemKart! Here are your digital redeem codes. You can easily copy the code below.</p>
                  
                  ${codesHtml}
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Need help redeeming your code?</p>
                    <a href="${process.env.FRONTEND_URL}/customer-support" style="display: inline-block; background: #f1f5f9; color: #475569; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 14px;">Contact Support</a>
                  </div>
                </div>
                
                <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
                  <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} RedeemKart. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `;

          await transporter.sendMail({
            from: `"RedeemKart" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: '🎉 Your Digital Voucher Codes from RedeemKart',
            html: emailHtml
          });
          console.log('Voucher email sent to:', recipientEmail);
        } catch (emailErr) {
          console.error('Error sending voucher email:', emailErr);
        }
      }

      return res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } else {
      const order = await Order.findById(orderId);
      if (order) {
        order.paymentStatus = 'failed';
        await order.save();
      }
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Signature mismatch'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

// Assign code manually (Admin)
const assignCodeToOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { brand, balance, code, pin, listingId } = req.body;

    if (!brand || !balance || !code) {
      return res.status(400).json({ success: false, message: 'Brand, balance, and code are required' });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // If a listingId is provided, mark that GiftCardListing as sold
    if (listingId) {
      const listing = await GiftCardListing.findById(listingId);
      if (listing) {
        listing.status = 'sold';
        if (order.userId) {
          listing.soldTo = order.userId;
        } else if (order.customerInfo && order.customerInfo.email) {
          const user = await User.findOne({ email: order.customerInfo.email });
          if (user) {
            listing.soldTo = user._id;
          }
        }
        await listing.save();
      }
    }

    // Add the new code to order.giftCodes
    order.giftCodes.push({
      brand,
      balance: parseFloat(balance),
      code,
      pin: pin || null,
      ...(listingId && { listingId })
    });

    // Update order status to delivered
    order.status = 'delivered';
    order.deliveryDate = new Date();
    await order.save();

    // Send email to customer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const recipientEmail = (order.recipientInfo && order.recipientInfo.email) ? order.recipientInfo.email : order.customerInfo.email;
      const recipientName = (order.recipientInfo && order.recipientInfo.name) ? order.recipientInfo.name : order.customerInfo.name;
      const logoUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/favicon.png` : 'https://redeemkart.in/favicon.png';

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #334155;">
          <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <div style="background: linear-gradient(to right, #fbbf24, #f59e0b); padding: 30px 20px; text-align: center;">
              <img src="${logoUrl}" alt="RedeemKart Logo" style="width: 64px; height: 64px; border-radius: 12px; margin-bottom: 16px; border: 2px solid #ffffff;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Your Digital Voucher</h1>
            </div>
            
            <div style="padding: 32px 24px;">
              <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5;">Hello <strong>${recipientName}</strong>,</p>
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.5;">Thank you for your purchase from RedeemKart! Here is your digital redeem code. You can easily copy the code below.</p>
              
              <div style="margin-bottom: 24px; padding: 20px; border-radius: 12px; background: #fffbeb; border: 1px solid #fde68a;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #92400e;">${brand} - Balance: ₹${balance}</p>
                <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px dashed #d97706; text-align: center; margin-bottom: 12px;">
                  <p style="margin: 0; font-size: 24px; font-family: monospace; font-weight: bold; color: #000000; letter-spacing: 2px; user-select: all;">${code}</p>
                </div>
                ${pin ? `<p style="margin: 0; font-size: 14px; color: #b45309; text-align: center;">PIN: <strong>${pin}</strong></p>` : ''}
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 14px; color: #64748b;">Need help redeeming your code?</p>
                <a href="${process.env.FRONTEND_URL}/customer-support" style="display: inline-block; background: #f1f5f9; color: #475569; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: 500; font-size: 14px;">Contact Support</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"RedeemKart" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: '🎉 Your Digital Voucher Code from RedeemKart',
        html: emailHtml
      });
    } catch (emailErr) {
      console.error('Error sending manual voucher email:', emailErr);
    }

    res.json({ success: true, message: 'Code assigned successfully', data: order });
  } catch (error) {
    console.error('Error assigning code:', error);
    res.status(500).json({ success: false, message: 'Failed to assign code', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrder,
  getOrdersByEmail,
  updateOrderStatus,
  getAllOrders,
  verifyPayment,
  assignCodeToOrder
};
