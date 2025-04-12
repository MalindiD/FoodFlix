const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');

// Register as delivery partner
router.post('/', partnerController.registerPartner);

// Get available partners
router.get('/available', partnerController.getAvailablePartners);

// Update partner location
router.put('/:id/location', partnerController.updateLocation);

// Update partner availability status
router.put('/:id/status', partnerController.updateStatus);

// Get partner's active delivery
router.get('/:id/active-delivery', partnerController.getActiveDelivery);

module.exports = router;