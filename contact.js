// contact.js
document.addEventListener('DOMContentLoaded', () => {
  const ticketInfo = document.getElementById('ticket-info');
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const alertSound = document.getElementById('alert-sound');

  let ticketId = localStorage.getItem('ticketId');
  let userEmail = localStorage.getItem('userEmail');

  if (!ticketId || !userEmail) {
    ticketInfo.textContent = 'Ticket info missing.';
    sendButton.disabled = true;
    userInput.disabled = true;
    return;
  }

  ticketInfo.textContent = `Ticket #${ticketId}`;

  const socket = new WebSocket('wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1');

  socket.onopen = () => {
    console.log('Connected to PieSocket as user.');
    socket.send(JSON.stringify({
      event: 'userConnected',
      ticketId,
      email: userEmail
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.event === 'adminMessage' && data.ticketId === ticketId) {
      appendMessage(data.message, 'admin');
      alertSound.play();
    }

    if (data.event === 'ticketClosed' && data.ticketId === ticketId) {
      appendMessage('This ticket has been closed by an admin.', 'system');
      sendButton.disabled = true;
      userInput.disabled = true;
    }
  };

  sendButton.addEventListener('click', () => {
    const message = userInput.value.trim();
    if (!message) return;

    socket.send(JSON.stringify({
      event: 'userMessage',
      ticketId,
      email: userEmail,
      message
    }));

    appendMessage(message, 'user');
    userInput.value = '';
  });

  function appendMessage(message, sender) {
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', sender);
    msgEl.textContent = message;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
