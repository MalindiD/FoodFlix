const Notification = require('../models/Notification');
const { sendEmail } = require('../utils/emailService');
const { sendSMS } = require('../utils/smsService');
const { 
  generateTrackingSmsMessage, 
  generateTrackingEmailMessage 
} = require('../utils/trackingLinkGenerator');

// Generic notification sender (email, sms or both)
exports.sendNotification = async (req, res) => {
  const { userId, type, channel, title, message, metadata = {} } = req.body;

  try {
    // Create and store notification in DB
    const notification = await Notification.create({
      userId,
      type,
      channel,
      title,
      message,
      metadata,
    });

    // For order confirmations, use tracking links
    let emailContent = message;
    let smsContent = message;
    
    if (channel === 'order' && metadata.orderId) {
      // Generate tracking messages
      const customerName = metadata.customerName || 'Customer';
      const { text, html } = generateTrackingEmailMessage(customerName, metadata.orderId);
      emailContent = html;
      smsContent = generateTrackingSmsMessage(customerName, metadata.orderId);
    }

    // Send Email if needed
    if ((type === 'email' || type === 'both') && metadata.email) {
      await sendEmail(metadata.email, title,emailContent);
    }

    // Send SMS if needed
    if ((type === 'sms' || type === 'both') && metadata.phone) {
      await sendSMS(metadata.phone, smsContent);
    }

    // Update status to sent
    notification.status = 'sent';
    await notification.save();

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error('❌ Error sending notification:', err);
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};

// Order notification shortcut
exports.sendOrderNotification = async (req, res) => {
  req.body.channel = 'order';
  req.body.title = 'Order Update';
  exports.sendNotification(req, res);
};

// Payment notification shortcut
exports.sendPaymentNotification = async (req, res) => {
  req.body.channel = 'payment';
  req.body.title = 'Payment Status';
  exports.sendNotification(req, res);
};

// Get all notifications for a specific user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Admin: fetch all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notifications.length, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch all notifications' });
  }
};
