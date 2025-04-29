const express = require('express');
const {
  sendNotification,
  sendOrderNotification,
  sendPaymentNotification,
  getUserNotifications,
  getAllNotifications
} = require('../controllers/notification');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Generic notification (email/sms/both)
router.post('/', protect,authorize('admin', 'system'), sendNotification);

// Order-specific notification
router.post('/order', protect, sendOrderNotification);

// Payment-specific notification
router.post('/payment', protect, sendPaymentNotification);

// Real-time delivery notification (NO AUTH for testing)
router.post('/realtime', (req, res) => {
  const { deliveryPartnerId, orderId } = req.body;

  const io = req.app.get('io');
  if (io && deliveryPartnerId && orderId) {
    io.to(deliveryPartnerId).emit('orderAssigned', {
      message: `🚚 You have been assigned to Order #${orderId}`,
      orderId,
    });
    console.log(`📡 Real-time socket sent to ${deliveryPartnerId} for Order ${orderId}`);
  } else {
    console.warn('⚠️ Missing Socket.IO instance or required fields');
  }

  res.status(200).json({
    success: true,
    message: 'Delivery partner notified in real-time'
  });
});

// User-specific notifications
router.get('/user/:userId', protect, getUserNotifications);

// Admin: view all
router.get('/', protect, authorize('admin'), getAllNotifications);

module.exports = router;
