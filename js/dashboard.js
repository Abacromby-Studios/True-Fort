const socket = io();

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (!email || !subject || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }

            fetch('/create-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, subject, message })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.ticketId) {
                    showFormMessage('Your message has been sent! An admin will reply shortly.', 'success');
                    contactForm.style.display = 'none';
                    startUserChat(data.ticketId, email);
                } else {
                    showFormMessage('There was an error. Try again.', 'error');
                }
            });
        });
    }

    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    function startUserChat(ticketId, email) {
        const chatBox = document.getElementById('liveChat');
        chatBox.style.display = 'block';

        const input = document.getElementById('userMessage');
        const sendBtn = document.getElementById('sendMessage');

        sendBtn.onclick = () => {
            const msg = input.value.trim();
            if (msg) {
                socket.emit('user_message', { ticketId, message: msg });
                document.getElementById('chatMessages').innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
                input.value = '';
            }
        };

        socket.on('admin_message', ({ ticketId: incomingId, message }) => {
            if (incomingId === ticketId) {
                document.getElementById('chatMessages').innerHTML += `<div><strong>Admin:</strong> ${message}</div>`;
            }
        });
    }
});
