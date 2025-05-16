const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location-controller');
const { protect, authorize } = require('../middleware/auth');

// Update delivery partner location (delivery partners only)
router.post('/update', protect, authorize('delivery'), locationController.updateLocation);

// Get location for a specific order (public route with rate limiting)
router.get('/order/:orderId', locationController.getOrderLocation);

module.exports = router;
