const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const DeliveryPartner = require('../models/DeliveryPartner');
const protect = require('../middleware/auth'); // Add middleware

//Reset availability - admin use (protected)
router.put('/reset/availability', protect, async (req, res) => {
  try {
    const result = await DeliveryPartner.updateMany({}, { isAvailable: true });
    res.status(200).json({ message: `Reset ${result.modifiedCount} partners.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get all partners (protected)
router.get('/all', protect, async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register partner (protected - only admins or verified delivery?)
router.post('/register', protect, partnerController.registerPartner);

// Get available partners (public or optionally protected)
router.get('/available', partnerController.getAvailablePartners);

// Update availability (protected - delivery role)
router.put('/:id/availability', protect, partnerController.updateAvailability);

// Get partner by ID (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
