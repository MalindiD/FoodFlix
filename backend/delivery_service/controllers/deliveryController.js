const Delivery = require('../models/Delivery');
const { assignDeliveryPartner } = require('../services/assignmentService');

// Assign partner to mock order
exports.createAssignment = async (req, res) => {
    try {
      const { orderId, customerLocation } = req.body;
  
      if (!orderId || !customerLocation?.lat || !customerLocation?.lng) {
        return res.status(400).json({ error: 'orderId and customerLocation (lat, lng) are required' });
      }
  
      const assignment = await assignDeliveryPartner(orderId, customerLocation);
      res.status(201).json(assignment);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
if (!status) return res.status(400).json({ error: 'Status is required' });

const cleanedStatus = status.trim();

    const delivery = await Delivery.findOneAndUpdate(
      { orderId: req.params.orderId },
      { deliveryStatus: status },
      { new: true }
    ).populate('deliveryPartner');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDeliveryDetails = async (req, res) => {
    const { orderId } = req.params;
    try {
      const delivery = await Delivery.findOne({ orderId }).populate('deliveryPartner');
      if (!delivery) return res.status(404).json({ message: "Delivery not found" });
  
      res.status(200).json({ partner: delivery.deliveryPartner });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

// Get delivery tracking status
exports.getDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId })
      .populate('deliveryPartner');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
