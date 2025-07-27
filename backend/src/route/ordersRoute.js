const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controller/orderController");
const authMiddleware = require("../middleware/token-middleware");
const adminOnly = require("../middleware/admin-middleware");

// Place a new order (user)
router.post("/", authMiddleware, createOrder);

// Get all orders (admin only)
router.get("/", authMiddleware, getAllOrders);

// Update order status (admin only)
router.put("/:id/status", authMiddleware, updateOrderStatus);

module.exports = router;
