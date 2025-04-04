// routes/notification.js
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

// Middleware to handle undefined controller methods
const handleUndefinedMethod = (methodName) => {
  return (req, res, next) => {
    console.error(`Undefined method: ${methodName}`);
    res.status(500).json({
      success: false,
      message: `Method ${methodName} is not implemented`
    });
  };
};

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Notification service is healthy',
    timestamp: new Date().toISOString()
  });
});

// Protected routes with fallback handlers
router.post('/', 
  protect, 
  sendNotification || handleUndefinedMethod('sendNotification')
);

router.post('/order', 
  protect, 
  sendOrderNotification || handleUndefinedMethod('sendOrderNotification')
);

router.post('/payment', 
  protect, 
  sendPaymentNotification || handleUndefinedMethod('sendPaymentNotification')
);

router.get('/user/:userId', 
  protect, 
  getUserNotifications || handleUndefinedMethod('getUserNotifications')
);

// Admin only routes
router.get('/', 
  protect, 
  authorize('admin'), 
  getAllNotifications || handleUndefinedMethod('getAllNotifications')
);

// Catch-all error handler
router.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

module.exports = router;