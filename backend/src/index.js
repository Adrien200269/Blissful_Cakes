const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 