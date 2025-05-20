const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // Make sure this is in your .env

async function sendEmail(to, subject, text, html = null) {
  const msg = {
    to,
    from: process.env.EMAIL_FROM, // ✅ FIXED: should be a verified sender
    subject,
    text,
    html: html || `<p>${text}</p>`,
  };

  try {
    await sgMail.send(msg);
    console.log('✅ Email sent to:', to);
    return { success: true };
  } catch (error) {
    console.error('❌ Email send failed:', error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEmail };
