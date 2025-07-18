const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const {sequelize, connectDB} = require('./database/index.js');
const {product} = require('../models/product.js'); 
const {User} = require('../src/models/user/User.js');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./route/auth/authRoute'));
app.use('/api/user', require('./route/user/userRoute'));
app.use('/api/upload', require('./route/uploadRoutes'));
app.use('/api/products', require('./route/productsRoute'));
app.use('/api/orders', require('./route/ordersRoute'));
app.use('/api/admin', require('./route/adminRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Blissful Cakes Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// const sequelize = new Sequelize('blissful_cakes', 'postgres', 'Poz@9841271385', {
//   host: '127.0.0.1',
//   dialect: 'postgres'
// });
connectDB()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 

