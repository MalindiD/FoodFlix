const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const DeliveryPartner = require('../models/DeliveryPartner');
const { protect, authorize } = require('../middleware/auth');

// Public login route
router.post('/login', partnerController.loginPartner);

// Register partner (only authenticated delivery can register)
router.post('/register', partnerController.registerPartner);

// Get all partners (only delivery can view)
router.get('/all', protect, authorize('delivery'), async (req, res) => {
  try {
    const partners = await DeliveryPartner.find();
    res.status(200).json(partners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add this route for partner profile
router.get('/me', protect, async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.user.id);

    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }

    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update availability
router.put('/:id/availability', protect, authorize('delivery'), partnerController.updateAvailability);

// Get partner by ID
router.get('/:id', protect, authorize('delivery'), async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(partner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset all availability (for now: delivery role only)
router.put('/reset/availability', protect, authorize('delivery'), async (req, res) => {
  try {
    const result = await DeliveryPartner.updateMany({}, { isAvailable: true });
    res.status(200).json({ message: `Reset ${result.modifiedCount} partners.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
