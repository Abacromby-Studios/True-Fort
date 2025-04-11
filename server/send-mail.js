const nodemailer = require("nodemailer");

// Create a Nodemailer transport instance using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",  // Use Gmail's email service
  auth: {
    user: process.env.MAIL_USER,  // Your Gmail email (from .env)
    pass: process.env.MAIL_PASS,  // Your Gmail password (from .env)
  },
});

// Function to send the email
function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.MAIL_USER,  // Your Gmail email (from .env)
    to,  // Recipient's email address
    subject,  // Subject of the email
    html,  // HTML content of the email (from contact form)
  };

  // Send the email using the transport instance
  return transporter.sendMail(mailOptions)
    .then(info => {
      console.log('Email sent: ' + info.response);
    })
    .catch(error => {
      console.error('Error sending email: ', error);
      throw new Error('Failed to send email');
    });
}

module.exports = sendMail;  // Export the function to use in other files
