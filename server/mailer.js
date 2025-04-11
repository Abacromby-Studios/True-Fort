const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function sendMail(to, subject, html) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
