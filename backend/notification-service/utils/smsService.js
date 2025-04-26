const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const isDevelopmentMode = !accountSid || !accountSid.startsWith('AC');

let client;
if (!isDevelopmentMode) {
  client = twilio(accountSid, authToken);
}

const sendSMS = async (to, message) => {
  if (isDevelopmentMode) {
    console.log('🚧 DEVELOPMENT MODE: SMS not actually sent');
    console.log({ to, message });
    return { success: true, development: true };
  }

  try {
    const res = await client.messages.create({
      body: message,
      from: fromNumber,
      to,
    });
    console.log('✅ SMS sent:', res.sid);
    return { success: true };
  } catch (error) {
    console.error('❌ SMS send failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
