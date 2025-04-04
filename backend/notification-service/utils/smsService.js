// utils/smsService.js
const twilio = require('twilio');

// Check if we're in development mode
const isDevelopmentMode = 
  process.env.TWILIO_ACCOUNT_SID === 'ACdevelopment_mode_only' ||
  !process.env.TWILIO_ACCOUNT_SID.startsWith('AC');

// Initialize Twilio client only if not in development mode
let client;
if (!isDevelopmentMode) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

/**
 * Send SMS notification
 * @param {String} to Recipient phone number (E.164 format)
 * @param {String} message SMS content
 * @returns {Promise} Twilio response
 */
const sendSMS = async (to, message) => {
  // In development mode, log the SMS instead of sending it
  if (isDevelopmentMode) {
    console.log('DEVELOPMENT MODE: SMS would be sent');
    console.log({ to, message });
    return { success: true, development: true };
  }

  try {
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    
    console.log('SMS sent successfully:', response.sid);
    return { success: true, response };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false, error: error.message };
  }
};