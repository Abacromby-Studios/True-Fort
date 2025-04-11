const chatSocket = io();
const chatForm = document.getElementById('chatForm');
const chatBox = document.getElementById('chatBox');
const ticketId = localStorage.getItem('ticketId');

if (ticketId) {
  chatSocket.emit('joinTicket', ticketId);

  chatSocket.on('message', (data) => {
    const messageEl = document.createElement('div');
    messageEl.className = 'chat-message';
    messageEl.textContent = `${data.sender}: ${data.text}`;
    chatBox.appendChild(messageEl);
    chatBox.scrollTop = chatBox.scrollHeight;
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatForm.querySelector('input');
    const message = input.value;
    if (message) {
      chatSocket.emit('userMessage', { ticketId, message });
      input.value = '';
    }
  });
}
