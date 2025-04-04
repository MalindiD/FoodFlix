const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
