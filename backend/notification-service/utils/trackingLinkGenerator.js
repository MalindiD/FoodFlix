/**
 * Generate a tracking link for an order
 * @param {string} orderId - The order ID
 * @param {boolean} isPublic - Whether to generate a public tracking link
 * @returns {string} The tracking URL
 */
const generateTrackingLink = (orderId, isPublic = false) => {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:3001';
    
    if (isPublic) {
      return `${baseUrl}/track/${orderId}`;
    } else {
      return `${baseUrl}/orders/track/${orderId}`;
    }
  };
  
  /**
   * Generate SMS message with tracking link
   * @param {string} customerName - The customer's name
   * @param {string} orderId - The order ID
   * @returns {string} Formatted SMS message with tracking link
   */
  const generateTrackingSmsMessage = (customerName, orderId) => {
    const trackingUrl = generateTrackingLink(orderId, true);
    
    return `Hi ${customerName}, your order #${orderId.substring(0, 8)} has been placed successfully! Track your order in real-time: ${trackingUrl}`;
  };
  
  /**
   * Generate email message with tracking link and HTML formatting
   * @param {string} customerName - The customer's name
   * @param {string} orderId - The order ID
   * @returns {Object} Object with text and html versions of the email
   */
  const generateTrackingEmailMessage = (customerName, orderId) => {
    const trackingUrl = generateTrackingLink(orderId, true);
    
    const text = `Hi ${customerName}, your order #${orderId.substring(0, 8)} has been placed successfully! Track your order in real-time: ${trackingUrl}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #FF6B35;">Order Confirmation</h2>
        <p>Hi ${customerName},</p>
        <p>Your order <strong>#${orderId.substring(0, 8)}</strong> has been placed successfully!</p>
        <p>You can track your order in real-time:</p>
        <a href="${trackingUrl}" style="display: inline-block; background-color: #FF6B35; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0;">Track Your Order</a>
        <p>Thank you for choosing FoodFlix!</p>
      </div>
    `;
    
    return { text, html };
  };
  
  module.exports = {
    generateTrackingLink,
    generateTrackingSmsMessage,
    generateTrackingEmailMessage
  };
  