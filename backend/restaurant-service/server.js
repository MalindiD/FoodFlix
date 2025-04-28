const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3001", // React frontend origin
    credentials: true
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Static files (images)

// MongoDB connection
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://y3s2projectgroup:JuQT6yqnVdZ6FQ97@foodflix.j0p0p.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 60000
    }
  )
  .then(() => {
    console.log("Connected to MongoDB successfully");
    console.log("Connection URI:", process.env.MONGO_URI);
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    console.error("Full Error Details:", JSON.stringify(err, null, 2));
  });

// ✅ Auth routes
const restaurantAuthRoutes = require("./routes/restaurant/authRoutes");
app.use("/api/auth", restaurantAuthRoutes);

app.get("/api/auth/ping", (req, res) => {
  res.send("pong 🏓");
});
console.log("✅ /api/auth route mounted");
console.log("🟢 Server is running on port", process.env.PORT || 5000);

// ✅ Restaurant core functionality
const restaurantRoutes = require("./routes/restaurant/restaurantRoutes");
const menuItemRoutes = require("./routes/restaurant/menuItemRoutes");
const orderRoutes = require("./routes/restaurant/orderRoutes");
const locationRoutes = require("./routes/location");


app.use("/api/restaurants", restaurantRoutes);
app.use("/api/restaurants/:restaurantId/menu-items", menuItemRoutes);
app.use("/api/restaurants/:restaurantId/orders", orderRoutes);
app.use(locationRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
