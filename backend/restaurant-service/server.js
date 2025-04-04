const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const restaurantRoutes = require("./routes/restaurantRoutes");
const menuItemRoutes = require("./routes/menuItemRoutes");
const orderRoutes = require("./routes/orderRoutes");
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
    console.log("Connection URI:", process.env.MONGO_URI);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    console.error("Full Error Details:", JSON.stringify(err, null, 2));
  });

// Routes
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/restaurants/:restaurantId/menu-items", menuItemRoutes);
app.use("/api/orders", orderRoutes);

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
