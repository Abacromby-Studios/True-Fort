// api/appeal.js
import sendMail from '../../send-mail'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, username, banReason, appealReason } = req.body;

    if (!email || !username || !banReason || !appealReason) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Set up the email content
      const html = `
        <h3>Ban Appeal Submission</h3>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Username:</strong> ${username}</p>
        <p><strong>Ban Reason:</strong> ${banReason}</p>
        <p><strong>Appeal Reason:</strong> ${appealReason}</p>
      `;
      await sendMail(process.env.EMAIL_USER, `Ban Appeal: ${username}`, html); // Send to your email address
      return res.status(200).json({ message: 'Your appeal has been submitted.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to submit appeal. Please try again later.' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' }); // Only accept POST requests
  }
}
