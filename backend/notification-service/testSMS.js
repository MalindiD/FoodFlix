require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  console.error("❌ Missing Twilio credentials. Check your .env file!");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: '🚀 Hello from FoodFlix via Twilio!',
    from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio number
    to: '+94770758438'                      // Your verified number
  })
  .then(message => console.log('✅ SMS sent! SID:', message.sid))
  .catch(error => console.error('❌ Error:', error.message));
