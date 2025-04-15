const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

let ticketId = sessionStorage.getItem('ticketId');
let username = sessionStorage.getItem('username');
let department = sessionStorage.getItem('department');

if (!ticketId || !username || !department) {
  window.location.href = 'contact.html';
}

appendMessage('system', `You are now connected with the ${department}. Ticket ID: #${ticketId}`);

const piesocket = new WebSocket(`wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1`);

piesocket.addEventListener('open', () => {
  piesocket.send(JSON.stringify({
    type: 'join',
    ticketId,
    username,
    department
  }));
});

piesocket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  if (data.type === 'admin') {
    appendMessage('admin', data.message);
    alert('You have a new message from support!');
    playNotification();
  } else if (data.type === 'system') {
    appendMessage('system', data.message);
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatInput.value.trim();
  if (message) {
    appendMessage('user', message);
    piesocket.send(JSON.stringify({
      type: 'user',
      message,
      ticketId,
      username,
      department
    }));
    chatInput.value = '';
  }
});

function appendMessage(sender, message) {
  const msgEl = document.createElement('div');
  msgEl.className = `chat-message ${sender}`;
  msgEl.textContent = `${sender === 'user' ? 'You' : sender === 'admin' ? 'Admin' : ''}: ${message}`;
  chatBox.appendChild(msgEl);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function playNotification() {
  const audio = new Audio('notification.mp3');
  audio.play().catch(() => {});
}
