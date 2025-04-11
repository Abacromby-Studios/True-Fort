import { sendEmail } from './sendEmail.js'; // adjut path if needed

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, subject, message } = req.body;

  try {
    await sendEmail(
      process.env.EMAIL, // send TO your own support inbox
      `Contact Form: ${subject}`,
      `<p><strong>From:</strong> ${email}</p><p>${message}</p>`
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}
