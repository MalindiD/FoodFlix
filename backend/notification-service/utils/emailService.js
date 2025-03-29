// utils/emailService.js
const sgMail = require('@sendgrid/mail');

// Explicitly define the functions outside the module.exports
function generateEmailContent(template, templateData) {
  console.log('Generating email content', { template, templateData });
  
  // Default fallback template
  if (!template) {
    return `
      <html>
        <body>
          <h1>${(templateData && templateData.title) || 'Notification'}</h1>
          <p>${(templateData && templateData.message) || 'No additional details provided'}</p>
        </body>
      </html>
    `;
  }

  // Add specific template handling
  switch(template) {
    case 'order-confirmation':
      return `
        <html>
          <body>
            <h1>Order Confirmation</h1>
            <p>Order #${(templateData && templateData.orderId) || 'N/A'} has been confirmed.</p>
          </body>
        </html>
      `;
    default:
      return `
        <html>
          <body>
            <h1>${template}</h1>
            <p>${JSON.stringify(templateData)}</p>
          </body>
        </html>
      `;
  }
}

async function sendEmail(to, subject, text, html) {
  console.log('Sending email:', { to, subject, text, html });
  return { success: true, development: true };
}

// Export the functions directly
module.exports = {
  generateEmailContent,
  sendEmail
};