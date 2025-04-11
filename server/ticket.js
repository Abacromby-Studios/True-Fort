import { sendEmail } from '../server/send-mail.js';
import { sendPushNotification } from '../server/pushSender.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { email, department, subject, message } = req.body;

    if (!email || !department || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const ticket = {
        email,
        department,
        subject,
        message,
        timestamp: new Date().toISOString(),
    };

    try {
        // Send email confirmation to user
        await sendEmail(email, `Your ticket has been received: ${subject}`, `
            <p>Thank you for contacting TrueFort.</p>
            <p>We have received your message and will get back to you soon.</p>
            <hr>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br>${message}</p>
        `);

        // Send push notification to admin devices
        await sendPushNotification(`New ticket from ${email}: ${subject}`);

        // Emit the ticket to connected Socket.IO admins
        if (global.io) {
            global.io.emit('new-ticket', ticket);
        }

        res.status(200).json({ message: 'Ticket submitted successfully' });
    } catch (err) {
        console.error('Ticket creation error:', err);
        res.status(500).json({ message: 'Failed to submit ticket' });
    }
          }
