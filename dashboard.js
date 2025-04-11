document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const ticketList = document.getElementById('ticket-list');
  const chatHeader = document.getElementById('chat-header');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const closeButton = document.getElementById('close-button');
  const loginForm = document.getElementById('login-form');
  const passwordField = document.getElementById('password');
  const password = 'Alpha Lima Delta Bravo Charlie Five Five Seven Six 765518903';
  const errorMessage = document.getElementById('errorMessage');

  const alertSound = new Audio('/alert1.mp3'); // Make sure this file exists
  let currentTicketId = null;

  // Function to create ticket element
  function createTicketElement(ticketId, userName) {
    const ticketEl = document.createElement('div');
    ticketEl.classList.add('ticket');
    ticketEl.dataset.ticketId = ticketId;
    ticketEl.innerText = `Ticket #${ticketId} - ${userName}`;
    ticketEl.addEventListener('click', () => selectTicket(ticketId));
    return ticketEl;
  }

  // Load incoming ticket
  socket.on('newTicket', ({ ticketId, userName, message }) => {
    const ticketEl = createTicketElement(ticketId, userName);
    ticketList.appendChild(ticketEl);
    alertSound.play();
  });

  // Select ticket and load messages
  function selectTicket(ticketId) {
    currentTicketId = ticketId;
    chatHeader.textContent = `Ticket #${ticketId}`;
    chatMessages.innerHTML = '';

    socket.emit('getMessages', { ticketId });

    document.querySelectorAll('.ticket').forEach(ticket => {
      ticket.classList.remove('active');
    });
    const activeTicket = document.querySelector(`.ticket[data-ticket-id="${ticketId}"]`);
    if (activeTicket) activeTicket.classList.add('active');
  }

  // Render chat messages
  socket.on('chatMessages', (messages) => {
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
      const msgEl = document.createElement('div');
      msgEl.classList.add('message', msg.sender === 'admin' ? 'admin' : 'user');
      msgEl.textContent = msg.text;
      chatMessages.appendChild(msgEl);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // Receive live message
  socket.on('userMessage', ({ ticketId, message }) => {
    if (ticketId === currentTicketId) {
      const msgEl = document.createElement('div');
      msgEl.classList.add('message', 'user');
      msgEl.textContent = message;
      chatMessages.appendChild(msgEl);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    alertSound.play();
  });

  // Send admin reply
  sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (!message || !currentTicketId) return;

    socket.emit('adminMessage', {
      ticketId: currentTicketId,
      message
    });

    const msgEl = document.createElement('div');
    msgEl.classList.add('message', 'admin');
    msgEl.textContent = message;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    chatInput.value = '';
  });

  // Close ticket
  closeButton.addEventListener('click', () => {
    if (!currentTicketId) return;

    if (confirm('Are you sure you want to close this ticket?')) {
      socket.emit('closeTicket', { ticketId: currentTicketId });
      const ticketEl = document.querySelector(`.ticket[data-ticket-id="${currentTicketId}"]`);
      if (ticketEl) ticketEl.remove();
      chatMessages.innerHTML = '';
      chatHeader.textContent = 'Select a ticket';
      currentTicketId = null;
    }
  });

  // Ticket closed by backend
  socket.on('ticketClosed', ({ ticketId }) => {
    if (ticketId === currentTicketId) {
      chatMessages.innerHTML = '';
      chatHeader.textContent = 'Ticket closed';
      currentTicketId = null;
    }

    const ticketEl = document.querySelector(`.ticket[data-ticket-id="${ticketId}"]`);
    if (ticketEl) ticketEl.remove();
  });

  // Password authentication for dashboard access
  loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    if (passwordField.value === password) {
      loginForm.style.display = 'none'; // Hide login form
      document.getElementById('dashboard').style.display = 'block'; // Show dashboard
    } else {
      errorMessage.style.display = 'block'; // Show error message
      passwordField.value = ''; // Clear the password field
    }
  });
});
