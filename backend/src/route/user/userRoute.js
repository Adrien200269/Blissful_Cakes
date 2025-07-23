const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteUser, banUser, unbanUser, getAllUsers } = require('../../controller/user/userController');
const authMiddleware = require('../../middleware/token-middleware');
const adminOnly = require('../../middleware/admin-middleware');

// Protected routes - require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin: Get all users
router.get('/', authMiddleware, adminOnly, getAllUsers);

// Admin: Delete user
router.delete('/:id', authMiddleware, adminOnly, deleteUser);
// Admin: Ban user
router.patch('/:id/ban', authMiddleware, adminOnly, banUser);
// Admin: Unban user
router.patch('/:id/unban', authMiddleware, adminOnly, unbanUser);

module.exports = router; 