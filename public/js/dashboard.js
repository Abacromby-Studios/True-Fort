document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const ticketList = document.getElementById('ticketList');
  const chatBox = document.getElementById('chatBox');
  const ticketHeader = document.getElementById('ticketHeader');
  const messageForm = document.getElementById('messageForm');
  const messageInput = document.getElementById('messageInput');
  let currentTicketId = null;

  // Handle incoming new tickets
  socket.on('newTicket', (ticket) => {
    const ticketItem = document.createElement('div');
    ticketItem.classList.add('ticket-item');
    ticketItem.textContent = `Ticket #${ticket.ticketId} - ${ticket.email}`;
    ticketItem.dataset.ticketId = ticket.ticketId;
    ticketItem.dataset.email = ticket.email;
    ticketList.appendChild(ticketItem);
  });

  // Load chat history when clicking a ticket
  ticketList.addEventListener('click', (e) => {
    if (e.target.classList.contains('ticket-item')) {
      currentTicketId = e.target.dataset.ticketId;
      ticketHeader.textContent = `Chat for Ticket #${currentTicketId}`;
      chatBox.innerHTML = '';
      socket.emit('getChatHistory', currentTicketId);
    }
  });

  // Display full chat history
  socket.on('chatHistory', (history) => {
    chatBox.innerHTML = '';
    history.forEach((msg) => appendMessage(msg.sender, msg.message));
  });

  // Append a single message
  socket.on('ticketMessage', (data) => {
    if (data.ticketId === currentTicketId) {
      appendMessage(data.sender, data.message);
    }

    // Show browser alert
    if (Notification.permission === 'granted') {
      new Notification(`New message on Ticket #${data.ticketId}`, {
        body: data.message
      });
    }
  });

  // Submit admin message
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && currentTicketId) {
      socket.emit('adminMessage', {
        ticketId: currentTicketId,
        message
      });
      appendMessage('Admin', message);
      messageInput.value = '';
    }
  });

  // Append message to chat box
  function appendMessage(sender, message) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('chat-message');
    msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Request notification permission
  if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }

  // Send inactivity warning email
  document.getElementById('sendWarningBtn')?.addEventListener('click', () => {
    if (currentTicketId) {
      socket.emit('sendInactivityWarning', { ticketId: currentTicketId });
      alert('Inactivity warning sent.');
    }
  });

  // Close ticket button
  document.getElementById('closeTicketBtn')?.addEventListener('click', () => {
    if (currentTicketId) {
      socket.emit('closeTicket', { ticketId: currentTicketId });
      alert(`Ticket #${currentTicketId} closed.`);
      ticketHeader.textContent = '';
      chatBox.innerHTML = '';
      currentTicketId = null;
    }
  });
});
