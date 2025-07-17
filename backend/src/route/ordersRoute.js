const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controller/orderController');
const authMiddleware = require('../middleware/token-middleware');

// Place a new order (user)
router.post('/', authMiddleware, createOrder);

// Get all orders (admin)
router.get('/', authMiddleware, async (req, res, next) => {
  // Only allow admin to fetch all orders
  if (req.user && req.user.role === 'admin') {
    return getAllOrders(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

// Update order status (admin)
router.put('/:id/status', authMiddleware, async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return updateOrderStatus(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

module.exports = router; 