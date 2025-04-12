const DeliveryPartner = require('../models/DeliveryPartner');
const Delivery = require('../models/Delivery');

// Register as delivery partner
exports.registerPartner = async (req, res) => {
  try {
    const { userId, name, phone, vehicleType } = req.body;
    
    // Check if already registered
    const existingPartner = await DeliveryPartner.findOne({ userId });
    
    if (existingPartner) {
      return res.status(400).json({
        success: false,
        message: 'User is already registered as a delivery partner'
      });
    }
    
    // Create new partner
    const partner = new DeliveryPartner({
      userId,
      name,
      phone,
      vehicleType,
      status: 'offline'
    });
    
    await partner.save();
    
    res.status(201).json({
      success: true,
      data: partner
    });
  } catch (error) {
    console.error('Error registering partner:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering delivery partner',
      error: error.message
    });
  }
};

// Update partner location
exports.updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates format. Expecting [longitude, latitude]'
      });
    }
    
    const partner = await DeliveryPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Delivery partner not found'
      });
    }
    
    // Update location
    partner.currentLocation.coordinates = coordinates;
    await partner.save();
    
    res.status(200).json({
      success: true,
      message: 'Location updated successfully'
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating location',
      error: error.message
    });
  }
};

// Update partner availability status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be available, busy, or offline'
      });
    }
    
    const partner = await DeliveryPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Delivery partner not found'
      });
    }
    
    partner.status = status;
    await partner.save();
    
    res.status(200).json({
      success: true,
      data: {
        id: partner._id,
        status: partner.status
      }
    });
  } catch (error) {
    console.error('Error updating partner status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating partner status',
      error: error.message
    });
  }
};

// Get partner's active delivery
exports.getActiveDelivery = async (req, res) => {
  try {
    const partner = await DeliveryPartner.findById(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: 'Delivery partner not found'
      });
    }
    
    if (!partner.activeDeliveryId) {
      return res.status(404).json({
        success: false,
        message: 'No active delivery found'
      });
    }
    
    const delivery = await Delivery.findById(partner.activeDeliveryId);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Active delivery not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    console.error('Error fetching active delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active delivery',
      error: error.message
    });
  }
};

// Get available delivery partners
exports.getAvailablePartners = async (req, res) => {
  try {
    const partners = await DeliveryPartner.find({ status: 'available' })
      .select('name vehicleType currentLocation avgRating');
    
    res.status(200).json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching available partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available partners',
      error: error.message
    });
  }
};