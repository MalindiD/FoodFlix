const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/tracking-controller');
const { protect } = require('../middleware/auth');

// Protected route - requires authentication
router.get('/:orderId', protect, trackingController.getTrackingInfo);

// Public route - allows tracking without authentication (for sharing)
router.get('/public/:orderId', trackingController.getPublicTrackingInfo);

module.exports = router;
