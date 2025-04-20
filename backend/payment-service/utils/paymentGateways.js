const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);


/**
 * Process payment through Stripe
 * @param {Object} paymentData - Contains amount, currency, and payment method details
 * @returns {Promise} - Resolves with payment intent or rejects with error
 */
exports.processStripePayment = async (paymentData) => {
  try {
    console.log('Processing Stripe payment:', paymentData);
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(paymentData.amount * 100), // Stripe expects amount in cents
      currency: paymentData.currency || 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: paymentData.orderId,
        userId: paymentData.userId
      }
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status,
      provider: 'stripe'
    };
  } catch (error) {
    console.error('Stripe payment error:', error);
    throw new Error(`Stripe payment processing failed: ${error.message}`);
  }
};

/**
 * Verify payment status with Stripe
 * @param {string} paymentIntentId - The Stripe payment intent ID
 * @returns {Promise} - Resolves with payment status details
 */
exports.verifyStripePayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      status: paymentIntent.status,
      paymentDetails: paymentIntent,
      provider: 'stripe'
    };
  } catch (error) {
    console.error('Stripe verification error:', error);
    throw new Error(`Stripe payment verification failed: ${error.message}`);
  }
};