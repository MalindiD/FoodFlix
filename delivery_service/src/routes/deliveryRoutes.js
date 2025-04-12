const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// Create a new delivery
router.post('/', deliveryController.createDelivery);

// Get all deliveries
router.get('/', deliveryController.getDeliveries);

// Get delivery by ID
router.get('/:id', deliveryController.getDeliveryById);

// Get delivery by order ID
router.get('/order/:orderId', deliveryController.getDeliveryByOrderId);

// Update delivery status
router.put('/:id/status', deliveryController.updateDeliveryStatus);

module.exports = router;