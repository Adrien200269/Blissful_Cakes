const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct } = require('../controller/productsController');

// GET /api/products - list all products
router.get('/', getAllProducts);

// POST /api/products - add a new product
router.post('/', addProduct);

module.exports = router; 