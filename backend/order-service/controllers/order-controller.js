const Order = require('../models/CustomerOrders');
const axios = require('axios');

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;

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

    // ✅ Trigger delivery assignment
    try {
      await axios.post(
        `${DELIVERY_SERVICE_URL}/api/delivery/assign`,
        { orderId: savedOrder._id },
        { headers: { Authorization: req.headers.authorization } }
      );
      console.log(`Delivery assignment triggered for order ${savedOrder._id}`);
    } catch (err) {
      console.error("Error assigning delivery:", err.message);
    }

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
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.customerId.toString() === req.user.id;
    const isAdminOrRestaurant = ['admin', 'restaurant'].includes(req.user.role);

    if (!isOwner && !isAdminOrRestaurant) {
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
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!['restaurant', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

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
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isOwner = order.customerId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['Pending', 'Confirmed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// Get orders for restaurant
exports.getRestaurantOrders = async (req, res) => {
  try {
    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find({ restaurantId: req.user.restaurantId }).sort({ createdAt: -1 });
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
    const validStatuses = ['Pending', 'Completed', 'Failed'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (!['payment', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === 'Completed' && order.status === 'Pending') {
      order.status = 'Confirmed';
    }

    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status' });
  }
};
