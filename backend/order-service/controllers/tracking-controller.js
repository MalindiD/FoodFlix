const Order = require('../models/CustomerOrders');
const axios = require('axios');

const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

// Get tracking information for a specific order
exports.getTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get delivery information
    let deliveryInfo = null;
    try {
      const deliveryRes = await axios.get(
        `${DELIVERY_SERVICE_URL}/api/delivery/${orderId}/status`
      );
      deliveryInfo = deliveryRes.data;
    } catch (err) {
      console.error('Error fetching delivery info:', err.message);
    }

    // Combine order and delivery information
    const trackingInfo = {
      orderId: order._id,
      orderStatus: order.status,
      items: order.items,
      totalPrice: order.totalPrice,
      customerLocation: order.deliveryAddress,
      restaurantId: order.restaurantId,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      delivery: deliveryInfo || { deliveryStatus: 'Pending' }
    };

    res.status(200).json(trackingInfo);
  } catch (error) {
    console.error('Error getting tracking info:', error);
    res.status(500).json({ message: 'Error getting tracking info' });
  }
};

// Get public tracking information (no authentication required)
exports.getPublicTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // Get order details
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get delivery information
    let deliveryInfo = null;
    try {
      const deliveryRes = await axios.get(
        `${DELIVERY_SERVICE_URL}/api/delivery/${orderId}/status`
      );
      deliveryInfo = deliveryRes.data;
    } catch (err) {
      console.error('Error fetching delivery info:', err.message);
    }

    // Return limited tracking info for public access
    const publicTrackingInfo = {
      orderId: order._id,
      orderStatus: order.status,
      numberOfItems: order.items.length,
      delivery: deliveryInfo ? {
        deliveryStatus: deliveryInfo.deliveryStatus,
        driverLocation: deliveryInfo.driverLocation,
        estimatedDeliveryTime: deliveryInfo.estimatedDeliveryTime
      } : { deliveryStatus: 'Pending' }
    };

    res.status(200).json(publicTrackingInfo);
  } catch (error) {
    console.error('Error getting public tracking info:', error);
    res.status(500).json({ message: 'Error getting tracking info' });
  }
};
