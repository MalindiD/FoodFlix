const DeliveryPartner = require('../models/DeliveryPartner');

// Register new delivery partner
exports.registerPartner = async (req, res) => {
  try {
    const partner = await DeliveryPartner.create(req.body);
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all available delivery partners
exports.getAvailablePartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ isAvailable: true });
    res.status(200).json(partners);
  } catch (err) {
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
