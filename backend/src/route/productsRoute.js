const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, updateProduct, deleteProduct } = require('../controller/productsController');

// GET /api/products - list all products
router.get('/', getAllProducts);

// POST /api/products - add a new product
router.post('/', addProduct);

// PUT /api/products/:id - update a product
router.put('/:id', updateProduct);
// DELETE /api/products/:id - delete a product
router.delete('/:id', deleteProduct);

module.exports = router; 