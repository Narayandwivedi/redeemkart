require('dotenv').config();
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectToDb = require('./config/mongodb');
const productRoutes = require('./routes/productRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');
const addressRoutes = require('./routes/addressRoutes');
const chatRoutes = require('./routes/chatRoutes');
const seederRoutes = require('./routes/seederRoutes');
const heroRoutes = require('./routes/heroRoutes');
const shopCategoryRoutes = require('./routes/shopCategoryRoutes');
const giftCardRoutes = require('./routes/giftCardRoutes');
const adminGiftCardRoutes = require('./routes/adminGiftCardRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const app = express();
const PORT = process.env.PORT;

console.log('port is ', PORT);


// Middleware
app.use((req, res, next) => {
  console.log(">>>", req.method, req.originalUrl);
  next();
});
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://redeemkart.in',
    'https://www.redeemkart.in',
    'https://api.redeemkart.in',
    'https://www.api.redeemkart.in',
    'https://adm.redeemkart.in'
  ],
  credentials: true,
}))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploaded images
app.use('/uploads', express.static('uploads'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'RedeemKart API is working fine' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/seed', seederRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/shop-categories', shopCategoryRoutes);
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/admin/gift-cards', adminGiftCardRoutes);
app.use('/api/chatbot', chatbotRoutes);



// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await connectToDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
