const express = require('express');
const {
  createPayment,
  getPayments,
  getPaymentByOrderId,
  processPayment,
  verifyPayment,
  stripeWebhook,
  healthCheck
} = require('../controllers/payment');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Health check endpoint (no auth required)
router.get('/health', healthCheck);

// Stripe webhook route (no auth required)
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.post('/', protect, createPayment);
router.post('/process', protect, processPayment);
router.get('/verify/:paymentId', protect, verifyPayment);
router.get('/order/:orderId', protect, getPaymentByOrderId);

// Admin only routes
router.get('/', protect, authorize('admin'), getPayments);

// routes/payment.js - add this route for debugging
router.get('/test-auth', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: req.user.id,
      role: req.user.role
    }
  });
});

module.exports = router;