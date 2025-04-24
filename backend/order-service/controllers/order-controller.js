// controllers/orderController.js
const Order = require('../models/CustomerOrders');
const axios = require('axios');
// const config = require('../config');
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const customerId = req.user.id;

    // ✅ Verify restaurant
    const restaurantRes = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}`);
    const restaurant = restaurantRes.data;

    if (!restaurant || !restaurant.isAvailable) {
      return res.status(400).json({ message: 'Restaurant is not available' });
    }

    // ✅ Verify menu items
    for (const item of items) {
      try {
        const res = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/menu-items/${item.menuItemId}`);
        const menuItem = res.data;

        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({ message: `Menu item '${item.name}' is not available.` });
        }
      } catch (err) {
        return res.status(400).json({ message: `Failed to verify menu item '${item.name}'` });
      }
    }

    // ✅ Save order
    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({ message: 'Error creating order' });
  }
};


// Get all orders for a customer
exports.getCustomerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the customer or if admin/restaurant
    if (order.customerId !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status is one of the enum values
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only restaurant owners or admins can update status
    if (req.user.role !== 'restaurant' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const previousStatus = order.status;
    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only the customer who placed the order can cancel it
    if (order.customerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Only allow cancellation if order is still Pending or Confirmed
    if (order.status !== 'Pending' && order.status !== 'Confirmed') {
      return res.status(400).json({ message: 'Cannot cancel order that is already being prepared or delivered' });
    }
    
    const previousStatus = order.status;
    order.status = 'Cancelled';
    await order.save();
    
    // Notify restaurant about cancellation
    await publishToQueue('restaurant_notifications', {
      type: 'ORDER_CANCELLED',
      orderId: order._id,
      restaurantId: order.restaurantId
    });
    
    // Notify customer about cancellation
    await publishToQueue('customer_notifications', {
      type: 'ORDER_STATUS_CHANGED',
      customerId: order.customerId,
      orderId: order._id,
      previousStatus,
      newStatus: 'Cancelled'
    });
    
    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// Get restaurant orders (for restaurant owners)
exports.getRestaurantOrders = async (req, res) => {
  try {
    // Ensure user is a restaurant owner
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const restaurantId = req.user.restaurantId;
    const orders = await Order.find({ restaurantId }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching restaurant orders:', error);
    res.status(500).json({ message: 'Error fetching restaurant orders' });
  }
};