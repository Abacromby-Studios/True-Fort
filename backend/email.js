// email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendMail = async (email, department, subject, message) => {
    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: process.env.EMAIL_USERNAME,
        subject: `[${department.toUpperCase()}] ${subject}`,
        text: `From: ${email}\n\n${message}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
