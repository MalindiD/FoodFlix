const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');
const Delivery = require('../models/Delivery');
const DeliveryPartner = require('../models/DeliveryPartner');
const { protect, authorize } = require('../middleware/auth');


// ✅ Assign a delivery partner to a new order (protected)
router.post('/assign', protect, deliveryController.createAssignment);

// ✅ Get delivery details by internal ID (protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id).populate('deliveryPartner');
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notify-again', deliveryController.resendNotification);


// ✅ Update delivery status (protected)
router.put('/:orderId/status', protect, deliveryController.updateDeliveryStatus);

// ✅ Track delivery by order ID (protected)
router.get('/:orderId/status', protect, deliveryController.getDeliveryStatus);

module.exports = router;