const Delivery = require('../models/Delivery');

// Create a new delivery request
exports.createDelivery = async (req, res) => {
  try {
    const { orderId, pickupLocation, dropoffLocation } = req.body;
    
    // Validate required fields
    if (!orderId || !pickupLocation || !dropoffLocation) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Create delivery
    const delivery = new Delivery({
      orderId,
      pickupLocation,
      dropoffLocation,
      status: 'pending',
      statusHistory: [{ 
        status: 'pending',
        timestamp: new Date(),
        notes: 'Delivery request created'
      }]
    });
    
    await delivery.save();
    
    res.status(201).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating delivery',
      error: error.message
    });
  }
};

// Get delivery by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('partnerId', 'name phone vehicleType');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error fetching delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message
    });
  }
};

// Get delivery by order ID
exports.getDeliveryByOrderId = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId })
      .populate('partnerId', 'name phone vehicleType');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found for this order'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error fetching delivery by order ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message
    });
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    // Update status
    delivery.status = status;
    delivery.statusHistory.push({
      status,
      timestamp: new Date(),
      notes: notes || ''
    });
    
    // Set timestamps based on status
    if (status === 'picked_up') {
      delivery.actualPickupTime = new Date();
    } else if (status === 'delivered') {
      delivery.actualDeliveryTime = new Date();
    }
    
    await delivery.save();
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error updating delivery status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating delivery status',
      error: error.message
    });
  }
};

// Get all deliveries with optional filtering
exports.getDeliveries = async (req, res) => {
  try {
    const { status, partnerId } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (partnerId) filter.partnerId = partnerId;
    
    const deliveries = await Delivery.find(filter)
      .populate('partnerId', 'name phone')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message
    });
  }
};