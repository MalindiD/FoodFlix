const DeliveryPartner = require('../models/DeliveryPartner');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a delivery partner
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

   /* const existing = await DeliveryPartner.findOne({ phone });
    if (existing) {
      return res.status(409).json({ message: 'Partner already exists with this phone' });
    }*/

    const newPartner = new DeliveryPartner({
      name,
      email,
      phone,
      password, // ✅ let the pre-save hook hash this
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

// Login delivery partner
exports.loginPartner = async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: "Phone and password required" });
  }

  try {
    const partner = await DeliveryPartner.findOne({ phone });
    if (!partner) return res.status(404).json({ message: "Partner not found" });

    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: partner._id, role: 'delivery' },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      partner: {
        id: partner._id,
        name: partner.name,
        phone: partner.phone,
        email: partner.email
      }
    });
  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update availability
exports.updateAvailability = async (req, res) => {
  try {
    const updated = await DeliveryPartner.findByIdAndUpdate(
      req.params.id,
      { isAvailable: req.body.isAvailable },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Partner not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get available partners
exports.getAvailablePartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ isAvailable: true });
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
