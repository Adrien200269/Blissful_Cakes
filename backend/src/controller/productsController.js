const Product = require('../../models/product');

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// POST /api/products
const addProduct = async (req, res) => {
  try {
    const { name, price, description, image, rating, category } = req.body;
    console.log(req.body);
    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price, and category are required' });
    }
    const newProduct = await Product.create({
      name,
      price,
      description,
      image,
      rating,
      category
    });
    res.status(201).json(newProduct);
  } catch (error) {
    console.log('Add product error:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};
module.exports = { getAllProducts, addProduct }; 