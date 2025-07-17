const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteUser, banUser, unbanUser, getAllUsers } = require('../../controller/user/userController');
const authMiddleware = require('../../middleware/token-middleware');

// Protected routes - require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin: Get all users
router.get('/', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return getAllUsers(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

// Admin: Delete user
router.delete('/:id', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return deleteUser(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});
// Admin: Ban user
router.patch('/:id/ban', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return banUser(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});
// Admin: Unban user
router.patch('/:id/unban', authMiddleware, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return unbanUser(req, res, next);
  } else {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
});

module.exports = router; 