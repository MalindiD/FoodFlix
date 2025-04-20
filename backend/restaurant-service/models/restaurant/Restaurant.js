const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const RestaurantSchema = new mongoose.Schema({
  // 🔁 Existing fields (untouched)
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  cuisineType: {
    type: String,
    required: true
  },
  openingHours: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  // ✅ New fields for authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },

  // ✅ New optional field for profile image upload
  profileImage: {
    type: String,
    default: ""
  }
});

// 🔐 Password encryption before save
RestaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ✅ Compare raw password with hashed
RestaurantSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Restaurant", RestaurantSchema);
