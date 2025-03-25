const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  

// Example Route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Port
const PORT = process.env.PORT || 5000;  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// MongoDB Connection
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Failed to connect to MongoDB:", err));

