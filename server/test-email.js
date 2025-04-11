import { sendEmail } from './send-mail.js';

(async () => {
  try {
    await sendEmail(
      'gabek6892@gmail.com', 
      'Test Email from TrueFort',
      '<p>This is a test email sent from the send-mail.js module.</p>'
    );
    console.log('Email sent successfully!');
  } catch (err) {
    console.error('Failed to send email:', err);
  }
})();
