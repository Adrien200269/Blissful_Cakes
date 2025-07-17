const express = require('express');
const router = express.Router();
const { getAnalytics, getCounts } = require('../controller/adminController');
const authMiddleware = require('../middleware/token-middleware');

// Analytics endpoint (admin only)
router.get('/analytics', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return getAnalytics(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

// Counts endpoint (admin only)
router.get('/counts', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return getCounts(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

module.exports = router; 