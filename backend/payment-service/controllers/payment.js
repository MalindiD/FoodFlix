const Payment = require('../models/Payment');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/async');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

// Import payment gateway utilities
const { 
  processStripePayment,
  verifyStripePayment
} = require('../utils/paymentGateways');

// @desc    Create a new payment record
// @route   POST /api/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res, next) => {
  // Add user ID to request body
  req.body.user = req.user.id;
  
  // Validate required fields
  if (!req.body.order || !req.body.amount) {
    return next(new ErrorResponse('Order ID and amount are required', 400));
  }
  
  // Create payment record
  const payment = await Payment.create(req.body);
  
  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Get all payments (admin only)
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res, next) => {
  // Get all payments with pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  
  const total = await Payment.countDocuments();
  const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('order', 'orderNumber totalAmount')
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    success: true,
    count: payments.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: payments
  });
});

// @desc    Get payment by order ID
// @route   GET /api/payments/order/:orderId
// @access  Private
exports.getPaymentByOrderId = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findOne({ order: req.params.orderId })
    .populate('user', 'name email')
    .populate('order', 'orderNumber totalAmount');
  
  if (!payment) {
    return next(
      new ErrorResponse(`No payment found for order ${req.params.orderId}`, 404)
    );
  }
  
  // Check if user is authorized to view this payment (owner or admin)
  if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to access this payment`, 403)
    );
  }
  
  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = asyncHandler(async (req, res, next) => {
  const { orderId, paymentMethod, amount, currency } = req.body;
  
  // Add validation
  if (!orderId || !paymentMethod || !amount) {
    return next(new ErrorResponse('Please provide order ID, payment method, and amount', 400));
  }
  
  // Check if payment already exists for this order
  const existingPayment = await Payment.findOne({ order: orderId });
  if (existingPayment && existingPayment.status === 'completed') {
    return next(new ErrorResponse('Payment already completed for this order', 400));
  }
  
  // Prepare payment data
  const paymentData = {
    orderId,
    amount: parseFloat(amount),
    currency: currency || 'usd',
    userId: req.user.id,
    customerName: req.body.customerName,
    customerEmail: req.body.customerEmail
  };
  
  let paymentResult;
  
  try {
    // Process payment based on selected method
    if (paymentMethod === 'stripe') {
      paymentResult = await processStripePayment(paymentData);
    } else {
      return next(new ErrorResponse(`Unsupported payment method: ${paymentMethod}`, 400));
    }
    
    // Create or update payment record
    let payment;
    if (existingPayment) {
      payment = existingPayment;
      payment.paymentMethod = paymentMethod;
      payment.status = 'processing';
      payment.transactionId = paymentResult.paymentIntentId || `${paymentMethod}-${Date.now()}`;
      payment.paymentDetails = paymentResult;
      await payment.save();
    } else {
      payment = await Payment.create({
        order: orderId,
        user: req.user.id,
        amount: parseFloat(amount),
        currency: currency || 'USD',
        paymentMethod,
        status: 'processing',
        transactionId: paymentResult.paymentIntentId || `${paymentMethod}-${Date.now()}`,
        paymentDetails: paymentResult
      });
    }
    
    // Notify order service about payment status
    try {
      await axios.post(
        `${process.env.ORDER_SERVICE_URL}/api/orders/${orderId}/payment-update`,
        {
          status: 'processing',
          paymentId: payment._id,
          transactionId: payment.transactionId
        },
        {
          headers: {
            'Authorization': req.headers.authorization
          }
        }
      );
    } catch (error) {
      console.error('Error notifying order service:', error.message);
      // Don't fail the request if notification fails
    }
    
    res.status(200).json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        clientSecret: paymentResult.clientSecret,
        paymentMethod,
        status: payment.status,
        provider: paymentResult.provider,
        ...paymentResult
      }
    });
  } catch (error) {
    return next(new ErrorResponse(`Payment processing failed: ${error.message}`, 500));
  }
});

// @desc    Verify payment status
// @route   GET /api/payments/verify/:paymentId
// @access  Private
exports.verifyPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.paymentId);
  
  if (!payment) {
    return next(
      new ErrorResponse(`Payment not found with id of ${req.params.paymentId}`, 404)
    );
  }
  
  // Check if user is authorized to verify this payment
  if (payment.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Not authorized to verify this payment`, 403)
    );
  }
  
  let verificationResult;
  
  try {
    // Verify payment based on method
    if (payment.paymentMethod === 'stripe') {
      verificationResult = await verifyStripePayment(payment.transactionId);
    } else {
      return next(
        new ErrorResponse(`Verification not implemented for ${payment.paymentMethod}`, 400)
      );
    }
    
    // Update payment status based on verification
    if (verificationResult.status === 'succeeded') {
      payment.status = 'completed';
    } else if (verificationResult.status === 'requires_payment_method') {
      payment.status = 'failed';
    } else {
      payment.status = 'processing';
    }
    
    payment.paymentDetails = {
      ...payment.paymentDetails,
      verification: verificationResult
    };
    
    await payment.save();
    
    // Notify order service about payment status update
    try {
      await axios.post(
        `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.order}/payment-update`,
        {
          status: payment.status,
          paymentId: payment._id,
          transactionId: payment.transactionId
        },
        {
          headers: {
            'Authorization': req.headers.authorization
          }
        }
      );
    } catch (error) {
      console.error('Error notifying order service:', error.message);
    }
    
    res.status(200).json({
      success: true,
      data: {
        payment,
        verification: verificationResult
      }
    });
  } catch (error) {
    return next(
      new ErrorResponse(`Payment verification failed: ${error.message}`, 500)
    );
  }
});

// @desc    Webhook for Stripe callbacks
// @route   POST /api/payments/webhook/stripe
// @access  Public
exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  console.log('Webhook received from Stripe');
  
  // Verify Stripe webhook signature
  let stripeEvent;
  try {
    const signature = req.headers['stripe-signature'];
    
    // Use rawBody for signature verification
    stripeEvent = stripe.webhooks.constructEvent(
      req.rawBody, 
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    console.log('Stripe event verified:', stripeEvent.type);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle Stripe events
  if (stripeEvent.type === 'payment_intent.succeeded') {
    const paymentIntent = stripeEvent.data.object;
    await handleSuccessfulPayment('stripe', paymentIntent.id, paymentIntent);
  } else if (stripeEvent.type === 'payment_intent.payment_failed') {
    const paymentIntent = stripeEvent.data.object;
    await handleFailedPayment('stripe', paymentIntent.id, paymentIntent);
  }
  
  res.status(200).json({ received: true });
});

// Health check endpoint for readiness and liveness probes
exports.healthCheck = (req, res) => {
  res.status(200).json({ status: 'ok' });
};

// Helper function for handling successful payment webhook events
async function handleSuccessfulPayment(gateway, transactionId, webhookData) {
  try {
    // Find payment by transaction ID
    const payment = await Payment.findOne({ 
      transactionId: transactionId,
      paymentMethod: gateway 
    });
    
    if (payment) {
      console.log(`Found payment with ID: ${payment._id} for transaction ${transactionId}`);
      payment.status = 'completed';
      payment.paymentDetails = { 
        ...payment.paymentDetails, 
        webhook: webhookData,
        completedAt: new Date()
      };
      await payment.save();
      
      // Notify order service about successful payment
      try {
        await axios.post(
          `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.order}/payment-update`,
          {
            status: 'completed',
            paymentId: payment._id,
            transactionId: payment.transactionId
          }
        );
      } catch (error) {
        console.error('Error notifying order service:', error.message);
      }
      
      // Send notification to customer
      try {
        await axios.post(
          `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`,
          {
            userId: payment.user,
            orderId: payment.order,
            type: 'payment-success',
            message: `Your payment of ${payment.currency} ${payment.amount} was successful.`,
            data: {
              paymentId: payment._id,
              transactionId: payment.transactionId
            }
          }
        );
      } catch (error) {
        console.error('Error sending notification:', error.message);
      }
    } else {
      console.log(`No payment found with transaction ID: ${transactionId}`);
    }
  } catch (error) {
    console.error('Error processing successful payment:', error);
  }
}

// Helper function for handling failed payment webhook events
async function handleFailedPayment(gateway, transactionId, webhookData) {
  try {
    const payment = await Payment.findOne({ 
      transactionId: transactionId,
      paymentMethod: gateway 
    });
    
    if (payment) {
      payment.status = 'failed';
      payment.paymentDetails = { 
        ...payment.paymentDetails, 
        webhook: webhookData,
        failedAt: new Date()
      };
      await payment.save();
      
      // Notify order service about failed payment
      try {
        await axios.post(
          `${process.env.ORDER_SERVICE_URL}/api/orders/${payment.order}/payment-update`,
          {
            status: 'failed',
            paymentId: payment._id,
            transactionId: payment.transactionId
          }
        );
        
        // Send notification to customer about failed payment
        await axios.post(
          `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications/send`,
          {
            userId: payment.user,
            orderId: payment.order,
            type: 'payment-failed',
            message: `Your payment for order has failed. Please try again.`,
            data: {
              paymentId: payment._id,
              transactionId: payment.transactionId
            }
          }
        );
      } catch (error) {
        console.error('Error notifying services about failed payment:', error.message);
      }
    }
  } catch (error) {
    console.error('Error processing failed payment:', error);
  }
}