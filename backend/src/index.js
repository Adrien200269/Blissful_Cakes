const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const {product} = require('../models/product.js'); // Ensure this path is correct

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./route/auth/authRoute'));
app.use('/api/user', require('./route/user/userRoute'));
app.use('/api/upload', require('./route/uploadRoutes'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Blissful Cakes Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const sequelize = new Sequelize('blissful_cakes', 'postgres', 'Poz@9841271385', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync(); // <-- Add this line
  })
  .then(() => {
    console.log('All models were synchronized successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 