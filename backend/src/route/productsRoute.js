const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controller/productsController');
const authMiddleware = require('../middleware/token-middleware');
const adminOnly = require('../middleware/admin-middleware');

// GET /api/products - list all products
router.get('/', getAllProducts);

// POST /api/products - add a new product (admin only)
router.post('/', authMiddleware, addProduct);

// PUT /api/products/:id - update a product (admin only)
router.put('/:id', authMiddleware, updateProduct);
// DELETE /api/products/:id - delete a product (admin only)
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router; 