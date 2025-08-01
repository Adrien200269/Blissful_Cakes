const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS for testing
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", require("../src/route/auth/authRoute"));
app.use("/api/user", require("../src/route/user/userRoute"));
app.use("/api/upload", require("../src/route/uploadRoutes"));
app.use("/api/products", require("../src/route/productsRoute"));
app.use("/api/orders", require("../src/route/ordersRoute"));
app.use("/api/admin", require("../src/route/adminRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Blissful Cakes Backend API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app; 