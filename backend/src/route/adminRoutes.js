const express = require('express');
const router = express.Router();
const { getAnalytics, getCounts } = require('../controller/adminController');
const authMiddleware = require('../middleware/token-middleware');
const adminOnly = require('../middleware/admin-middleware');

// Analytics endpoint (admin only)
router.get('/analytics', authMiddleware, adminOnly, getAnalytics);

// Counts endpoint (admin only)
router.get('/counts', authMiddleware, adminOnly, getCounts);

module.exports = router; 