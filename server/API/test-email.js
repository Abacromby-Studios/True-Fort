import { sendEmail } from '../../send-mail.js'; // Adjust path if needed

export default async function handler(req, res) {
    try {
        await sendEmail(
            process.env.EMAIL, // Sends to yourself
            'Test Email from TrueFort',
            '<h1>Hello from your test route!</h1><p>This is a test email from your Vercel API.</p>'
        );

        res.status(200).json({ success: true, message: 'Test email sent successfully.' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
}
