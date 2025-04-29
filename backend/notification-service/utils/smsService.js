const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const isDevelopmentMode = !accountSid || !accountSid.startsWith('AC');

let client;
if (!isDevelopmentMode) {
  client = twilio(accountSid, authToken);
}

// Clean and format Sri Lankan numbers to E.164
function formatSriLankanNumber(phone) {
  if (!phone) return null;
  
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Handle numbers starting with 94 (without country code)
  if (cleaned.startsWith('94') && cleaned.length === 11) {
    return `+${cleaned}`;
  }
  
  // Handle local format numbers (070...)
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    return `+94${cleaned.slice(1)}`;
  }

  // Handle numbers missing leading zero (7...)
  if (cleaned.startsWith('7') && cleaned.length === 9) {
    return `+94${cleaned}`;
  }

  // Already in E.164 format
  if (cleaned.startsWith('+94') && cleaned.length === 12) {
    return cleaned;
  }

  return null;
}

const sendSMS = async (to, message) => {
  const formattedTo = formatSriLankanNumber(to);

  if (!formattedTo) {
    console.error('❌ Invalid phone number format:', to);
    return { success: false, error: 'Invalid phone number format' };
  }

  if (isDevelopmentMode) {
    console.log('🚧 DEVELOPMENT MODE: SMS not actually sent');
    console.log({ to, message });
    return { success: true, development: true };
  }

  try {
    const res = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedTo,
    });
    console.log('✅ SMS sent:', res.sid);
    return { success: true };
  } catch (error) {
    console.error('❌ SMS send failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendSMS };
