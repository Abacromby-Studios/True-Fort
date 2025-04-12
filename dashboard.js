document.addEventListener('DOMContentLoaded', () => {
  const ticketList = document.getElementById('ticket-list');
  const chatHeader = document.getElementById('chat-header');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const closeButton = document.getElementById('close-button');
  const loginForm = document.getElementById('login-form');
  const passwordField = document.getElementById('password');
  const errorMessage = document.getElementById('errorMessage');
  const alertSound = new Audio('/alert1.mp3'); // Ensure file exists

  let currentTicketId = null;
  const socket = new WebSocket('wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1');

  // Setup WebSocket message handlers
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.event === 'newTicket') {
      const ticketEl = createTicketElement(data.ticketId, data.userName);
      ticketList.appendChild(ticketEl);
      alertSound.play();
    }

    if (data.event === 'userMessage' && data.ticketId === currentTicketId) {
      const msgEl = document.createElement('div');
      msgEl.classList.add('message', 'user');
      msgEl.textContent = data.message;
      chatMessages.appendChild(msgEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      alertSound.play();
    }

    if (data.event === 'chatMessages' && data.ticketId === currentTicketId) {
      chatMessages.innerHTML = '';
      data.messages.forEach(msg => {
        const msgEl = document.createElement('div');
        msgEl.classList.add('message', msg.sender === 'admin' ? 'admin' : 'user');
        msgEl.textContent = msg.text;
        chatMessages.appendChild(msgEl);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (data.event === 'ticketClosed') {
      if (data.ticketId === currentTicketId) {
        chatMessages.innerHTML = '';
        chatHeader.textContent = 'Ticket closed';
        currentTicketId = null;
      }
      const ticketEl = document.querySelector(`.ticket[data-ticket-id="${data.ticketId}"]`);
      if (ticketEl) ticketEl.remove();
    }
  };

  function createTicketElement(ticketId, userName) {
    const ticketEl = document.createElement('div');
    ticketEl.classList.add('ticket');
    ticketEl.dataset.ticketId = ticketId;
    ticketEl.innerText = `Ticket #${ticketId} - ${userName}`;
    ticketEl.addEventListener('click', () => selectTicket(ticketId));
    return ticketEl;
  }

  function selectTicket(ticketId) {
    currentTicketId = ticketId;
    chatHeader.textContent = `Ticket #${ticketId}`;
    chatMessages.innerHTML = '';

    socket.send(JSON.stringify({ event: 'getMessages', ticketId }));

    document.querySelectorAll('.ticket').forEach(ticket => ticket.classList.remove('active'));
    const activeTicket = document.querySelector(`.ticket[data-ticket-id="${ticketId}"]`);
    if (activeTicket) activeTicket.classList.add('active');
  }

  sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (!message || !currentTicketId) return;

    socket.send(JSON.stringify({
      event: 'adminMessage',
      ticketId: currentTicketId,
      message
    }));

    const msgEl = document.createElement('div');
    msgEl.classList.add('message', 'admin');
    msgEl.textContent = message;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';
  });

  closeButton.addEventListener('click', () => {
    if (!currentTicketId) return;

    if (confirm('Are you sure you want to close this ticket?')) {
      socket.send(JSON.stringify({ event: 'closeTicket', ticketId: currentTicketId }));
      const ticketEl = document.querySelector(`.ticket[data-ticket-id="${currentTicketId}"]`);
      if (ticketEl) ticketEl.remove();
      chatMessages.innerHTML = '';
      chatHeader.textContent = 'Select a ticket';
      currentTicketId = null;
    }
  });

  // Password authentication
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const inputPassword = passwordField.value;
    if (verifyPassword(inputPassword)) {
      loginForm.style.display = 'none';
      document.getElementById('dashboard').style.display = 'block';
    } else {
      errorMessage.style.display = 'block';
      passwordField.value = '';
    }
  });
});
