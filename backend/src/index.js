const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const sequelize = require("./database");
const { Order } = require("./models");

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

app.use(express.json());

// Routes
app.use("/api/auth", require("./route/auth/authRoute"));
app.use("/api/user", require("./route/user/userRoute"));
app.use("/api/upload", require("./route/uploadRoutes"));
app.use("/api/products", require("./route/productsRoute"));
app.use("/api/orders", require("./route/ordersRoute"));
app.use("/api/admin", require("./route/adminRoutes"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Blissful Cakes Backend API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Sync DB and start server
async function startServer() {
  try {
    await sequelize.sync({ alter: true }); // sync all models at once (drops and recreates tables)
    console.log("Database synced successfully");

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
}

// Export app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
  startServer();
}
