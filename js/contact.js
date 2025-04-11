document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const department = document.getElementById('department').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!email || !department || !subject || !message) {
                showFormMessage('Please fill in all fields.', 'error');
                return;
            }

            const ticketData = { email, department, subject, message };

            try {
                // Send the ticket to the backend for mail + push + chat
                const res = await fetch('/api/create-ticket', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ticketData)
                });

                const result = await res.json();
                if (res.ok) {
                    showFormMessage('Your message has been sent! We’ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showFormMessage(result.error || 'Failed to send your message.', 'error');
                }
            } catch (err) {
                showFormMessage('Server error. Please try again later.', 'error');
            }
        });
    }

    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            setTimeout(() => formMessage.style.display = 'none', 5000);
        }
    }
});
