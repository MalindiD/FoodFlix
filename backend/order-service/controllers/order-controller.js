const Order = require('../models/CustomerOrders');
const axios = require('axios');

const RESTAURANT_SERVICE_URL = process.env.RESTAURANT_SERVICE_URL;
const DELIVERY_SERVICE_URL = process.env.DELIVERY_SERVICE_URL;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL;

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, items, totalPrice, deliveryAddress } = req.body;
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
    // ✅ Check restaurant availability
    try {
      const restaurantResponse = await axios.get(`${RESTAURANT_SERVICE_URL}/api/restaurants/${restaurantId}/status`);
      if (!restaurantResponse.data.isAvailable) {
        return res.status(400).json({ message: 'Restaurant is currently unavailable' });
      }
    } catch (error) {
      console.error('Error checking restaurant availability:', error);
      return res.status(500).json({ message: 'Could not verify restaurant availability' });
    }

    // ✅ Create and save new order
    const newOrder = new Order({
      customerId,
      restaurantId,
      items,
      totalPrice,
      deliveryAddress,
      status: 'Pending'
    });

    const savedOrder = await newOrder.save();

    try {

      const jwt = require('jsonwebtoken');
      const serviceToken = jwt.sign(
        { id: 'order-service', role: 'system' ,service: true},
        process.env.JWT_SECRET,
        { expiresIn: '10m' }
      );
      console.log('[🔑 SERVICE TOKEN]', serviceToken);


      // Fetch customer details
      const authRes = await axios.get(
        `${AUTH_SERVICE_URL}/api/auth/users/${customerId}`,
        { headers: { Authorization: `Bearer ${serviceToken}`} }
      );
      const customer = authRes.data.data;
    
      // Send notification
      await axios.post(
        `${NOTIFICATION_SERVICE_URL}/api/notifications`,
        {
          userId: customer._id,
          type: 'both',
          channel: 'order',
          title: 'Order Placed Successfully',
          message: `Hi ${customer.name}, your order #${savedOrder._id} has been placed successfully!`,
          metadata: {
            email: customer.email,
            phone: customer.phone,
            orderId: savedOrder._id,
            customerName: customer.name
          }
        },
        {
          headers: { Authorization: `Bearer ${serviceToken}` }
        }
      );
      console.log('✅ Order confirmation notification sent to customer.');
    } catch (notifErr) {
      console.error('❌ Failed to send order confirmation notification:', notifErr.message);
    }

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
