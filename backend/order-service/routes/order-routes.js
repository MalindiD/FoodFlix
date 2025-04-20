const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const { protect, authorize } = require('../middleware/auth');

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

// Update payment status
router.patch('/:id/payment', protect, authorize('payment', 'admin'), orderController.updatePaymentStatus);

module.exports = router;
