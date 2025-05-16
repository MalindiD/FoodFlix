const Delivery = require('../models/Delivery');
const DeliveryPartner = require('../models/DeliveryPartner');

// Update delivery partner's location
exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const partnerId = req.user.id;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Update partner's location
    const partner = await DeliveryPartner.findByIdAndUpdate(
      partnerId,
      { 
        currentLocation: { 
          lat: parseFloat(latitude), 
          lng: parseFloat(longitude) 
        }
      },
      { new: true }
    );

    if (!partner) {
      return res.status(404).json({ message: 'Delivery partner not found' });
    }

    // Find all active deliveries for this partner and update their status
    const activeDeliveries = await Delivery.find({ 
      deliveryPartner: partnerId,
      deliveryStatus: { $in: ['Accepted', 'Picked Up', 'On The Way'] }
    });

    // Emit location update event via Socket.IO
    const io = req.app.get('io');
    if (io) {
      for (const delivery of activeDeliveries) {
        io.to(`order_${delivery.orderId}`).emit('locationUpdate', {
          orderId: delivery.orderId,
          location: partner.currentLocation,
          status: delivery.deliveryStatus,
          timestamp: new Date()
        });
      }
    }

    res.status(200).json({
      success: true,
      location: partner.currentLocation,
      activeDeliveries: activeDeliveries.map(d => d.orderId)
    });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Error updating location' });
  }
};

// Get location for a specific order
exports.getOrderLocation = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const delivery = await Delivery.findOne({ orderId }).populate('deliveryPartner');
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found for this order' });
    }
    
    if (!delivery.deliveryPartner) {
      return res.status(200).json({
        success: true,
        message: 'No driver assigned yet',
        location: null
      });
    }
    
    res.status(200).json({
      success: true,
      location: delivery.deliveryPartner.currentLocation,
      status: delivery.deliveryStatus
    });
  } catch (error) {
    console.error('Error getting order location:', error);
    res.status(500).json({ message: 'Error getting order location' });
  }
};
