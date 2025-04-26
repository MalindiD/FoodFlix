require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'senaratnehimesha@gmail.com', // ✔ your email
  from: 'senaratnehimesha@gmail.com', // ✔ must be verified in SendGrid
  subject: 'Test Email from FoodFlix',
  text: 'This is a test email via SendGrid',
  html: '<strong>This is a test email via SendGrid</strong>',
};

sgMail.send(msg)
  .then(() => {
    console.log('Email sent successfully');
  })
  .catch((error) => {
    console.error('Failed to send email:', error.message);
  });
