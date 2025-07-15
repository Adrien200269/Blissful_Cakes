const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../../controller/user/userController');
const authMiddleware = require('../../middleware/token-middleware');

// Protected routes - require authentication
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router; 