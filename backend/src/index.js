const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(

  cors({

    origin: function (origin, callback) {

      if (!origin || allowedOrigins.includes(origin)) {

        callback(null, true);

      } else {

        callback(new Error("Not allowed by CORS"));

      }

    },

    credentials: true,

  })

);
 

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

app.listen(PORT, () => {
  console.log(`server is listening in port ${PORT} `);
});

// sequelize.sync({alter: true})