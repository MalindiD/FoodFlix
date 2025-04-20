// controllers/orderController.js
const Order = require('../models/CustomerOrders');
const axios = require('axios');
// const config = require('../config');
const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const { publishToQueue } = require('../utils/messageQueue');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalAmount, deliveryAddress } = req.body;
    const customerId = req.user.id; // Assuming auth middleware sets this
    
    // Check restaurant availability via Restaurant Service
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/status`);
      if (!restaurantResponse.data.isAvailable) {
        return res.status(400).json({ message: 'Restaurant is currently unavailable' });
      }
    } catch (error) {
      console.error('Error checking restaurant availability:', error);
      return res.status(500).json({ message: 'Could not verify restaurant availability' });
    }
    
    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalAmount,
      deliveryAddress,
      status: 'Pending'
    });
    
    const savedOrder = await newOrder.save();
    
    // Notify restaurant service about new order
    try {
      await publishToQueue('restaurant_notifications', {
        type: 'NEW_ORDER',
        orderId: savedOrder._id,
        restaurantId,
        items
      });
      
      // Send notification to customer
      await publishToQueue('customer_notifications', {
        type: 'ORDER_PLACED',
        customerId,
        orderId: savedOrder._id,
        orderStatus: 'Pending'
      });
    } catch (error) {
      console.error('Error publishing to message queue:', error);
      // Continue anyway, as the order is created
    }
    
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
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
    
    // Notify customer about status change
    await publishToQueue('customer_notifications', {
      type: 'ORDER_STATUS_CHANGED',
      customerId: order.customerId,
      orderId: order._id,
      previousStatus,
      newStatus: status
    });
    
    // If status is "Out for Delivery", notify Delivery Service
    if (status === 'Out for Delivery') {
      await publishToQueue('delivery_assignments', {
        type: 'NEW_DELIVERY',
        orderId: order._id,
        restaurantId: order.restaurantId,
        customerId: order.customerId,
        deliveryAddress: order.deliveryAddress
      });
    }
    
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

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    
    // Validate payment status
    const validStatuses = ['Pending', 'Completed', 'Failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Only payment service or admin should update payment status
    if (req.user.role !== 'payment' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    order.paymentStatus = paymentStatus;
    await order.save();
    
    // If payment completed successfully, update order status to Confirmed
    if (paymentStatus === 'Completed' && order.status === 'Pending') {
      order.status = 'Confirmed';
      await order.save();
      
      // Notify restaurant about confirmed order
      await publishToQueue('restaurant_notifications', {
        type: 'ORDER_CONFIRMED',
        orderId: order._id,
        restaurantId: order.restaurantId
      });
      
      // Notify customer about confirmed order
      await publishToQueue('customer_notifications', {
        type: 'ORDER_STATUS_CHANGED',
        customerId: order.customerId,
        orderId: order._id,
        previousStatus: 'Pending',
        newStatus: 'Confirmed'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status' });
  }
};