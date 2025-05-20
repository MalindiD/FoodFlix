const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const { protect, authorize } = require('../middleware/auth');
const Order = require('../models/CustomerOrders'); 

// or correct model path if you named it differently

// Create a new order
router.post('/', protect, orderController.createOrder);

// Get all orders for a customer
router.get('/my-orders', protect, orderController.getCustomerOrders);

// Get order by ID
router.get('/:id', protect, orderController.getOrderById);

// Update order status
router.patch('/:id/status', protect, authorize('restaurant', 'admin'), orderController.updateOrderStatus);

// Cancel order
router.patch('/:id/cancel', protect, orderController.cancelOrder);

// Get restaurant orders
router.get('/restaurant/orders', protect, authorize('restaurant'), orderController.getRestaurantOrders);

// ✅ NEW Public Tracking route (no protect middleware here)
router.get('/tracking/public/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findById(orderId);
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        orderStatus: order.status,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order status' });
    }
  });

module.exports = router;
