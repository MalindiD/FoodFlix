const emailService = require('../utils/emailService');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/async');
const ErrorResponse = require('../utils/errorResponse');
const smsService = require('../utils/smsService');

exports.sendNotification = asyncHandler(async (req, res, next) => {
  const {
    userId,
    type = 'email',
    channel,
    title,
    message,
    template,
    templateData,
    recipient = {},
    metadata = {}
  } = req.body;

  // Validate required fields
  if (!userId) {
    return next(new ErrorResponse('User ID is required', 400));
  }

  // Ensure recipient is properly formatted
  if (type === 'email' && !recipient.email) {
    return next(new ErrorResponse('Recipient email is required for email notifications', 400));
  }

  try {
    // Explicitly check method existence
    if (typeof emailService.generateEmailContent !== 'function') {
      throw new Error('Email content generation method is not available');
    }

    // Generate HTML content
    const html = emailService.generateEmailContent(template, templateData);

    // Create notification record
    const notification = await Notification.create({
      userId,
      type,
      channel,
      title,
      message,
      metadata: {
        ...metadata,
        template,
        recipient
      }
    });

    // Send email
    const emailResult = await emailService.sendEmail(
      recipient.email,
      title,
      message,
      html
    );

    // Update notification status
    notification.status = emailResult.success ? 'sent' : 'failed';
    await notification.save();

    // Respond with result
    res.status(200).json({
      success: emailResult.success,
      data: notification,
      emailResult
    });

  } catch (error) {
    console.error('Notification send error:', error);
    return next(new ErrorResponse(`Failed to send notification: ${error.message}`, 500));
  }
});