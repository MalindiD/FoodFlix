const DeliveryPartner = require('../models/DeliveryPartner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register a delivery partner
exports.registerPartner = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      vehicleType,
      address,
      currentLocation,
      profileImage
    } = req.body;

    // ✅ Check for duplicate phone
    const existingPartner = await DeliveryPartner.findOne({ phone });
    if (existingPartner) {
      return res.status(409).json({ message: 'Partner already exists with this phone number' });
    }

    // ✅ Create new delivery partner
    const newPartner = new DeliveryPartner({
      name,
      email,
      phone,
      password, // Password will be hashed automatically (pre-save hook)
      vehicleType,
      address,
      currentLocation,
      profileImage,
      role: 'delivery'
    });

    await newPartner.save();

    res.status(201).json({
      message: 'Registered successfully',
      partner: {
        id: newPartner._id,
        name: newPartner.name,
        phone: newPartner.phone,
        email: newPartner.email
      }
    });
  } catch (err) {
    console.error('Registration Error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Login delivery partner
exports.loginPartner = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password are required" });
  }

  try {
    const partner = await DeliveryPartner.findOne({ phone });

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: partner._id, role: partner.role },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: partner._id,
        name: partner.name,
        phone: partner.phone,
        email: partner.email,
        role: partner.role
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update delivery partner availability
exports.updateAvailability = async (req, res) => {
  try {
    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );

    if (!updatedPartner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    res.status(200).json(updatedPartner);
  } catch (err) {
    console.error('Update Availability Error:', err.message);
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get available partners
exports.getAvailablePartners = async (req, res) => {
  try {
    const availablePartners = await DeliveryPartner.find({ isAvailable: true });
    res.status(200).json(availablePartners);
  } catch (err) {
    console.error('Get Available Partners Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
