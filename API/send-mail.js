import nodemailer from 'nodemailer';

export async function sendEmail(to, subject, html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,       // your Gmail address
            pass: process.env.EMAIL_PASS,  // your Gmail App Password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}
