const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  getOrder,
  getOrdersByEmail,
  updateOrderStatus,
  getAllOrders,
  verifyPayment,
  assignCodeToOrder
} = require('../controllers/orderController');

// Public routes
router.post('/', createOrder);                    // POST /api/orders - Create new order
router.post('/verify-payment', verifyPayment);     // POST /api/orders/verify-payment - Verify payment signature
router.get('/detail/:orderId', getOrder);         // GET /api/orders/detail/:orderId - Get order details by ID
router.get('/customer/:email', getOrdersByEmail); // GET /api/orders/customer/:email - Get orders by customer email
router.get('/:identifier', getOrder);             // GET /api/orders/:id - Get order by ID or order number

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.patch('/:orderId/status', protect, authorize('admin'), updateOrderStatus);
router.post('/:orderId/assign-code', protect, authorize('admin'), assignCodeToOrder);

module.exports = router;