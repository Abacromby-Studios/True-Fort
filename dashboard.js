// Importing the password decryption function from redacted.js
import { decodePassword } from "./redacted.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const passwordInput = document.getElementById("admin-password");
  const loginButton = document.getElementById("login-button");

  // Admin login functionality
  loginButton.addEventListener("click", () => {
    const decoded = decodePassword();
    if (passwordInput.value.trim() === decoded) {
      loginSection.style.display = "none";
      dashboardSection.style.display = "block";
    } else {
      alert("Incorrect password.");
    }
  });

  // WebSocket setup
  const socket = new WebSocket("wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1");

  // Ticket elements
  const ticketList = document.getElementById("ticket-list");
  const messageArea = document.getElementById("message-area");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-message");

  let currentTicketId = null;

  // Connect to WebSocket
  socket.onopen = () => {
    console.log("Connected to WebSocket server");

    // Listen for incoming ticket messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.action === "new-ticket") {
        displayTicket(data.ticketId, data.subject, data.email);
      } else if (data.ticketId === currentTicketId) {
        if (data.action === "user-message") {
          displayMessage("User", data.message);
        } else if (data.action === "admin-reply") {
          displayMessage("Admin", data.message);
        }
      }
    };
  };

  // Function to display new tickets in the admin panel
  function displayTicket(ticketId, subject, email) {
    const ticketItem = document.createElement("div");
    ticketItem.classList.add("ticket");
    ticketItem.innerHTML = `<strong>Ticket #${ticketId}:</strong> ${subject} - ${email}`;
    ticketItem.addEventListener("click", () => {
      loadTicket(ticketId);
    });
    ticketList.appendChild(ticketItem);
  }

  // Function to load a selected ticket
  function loadTicket(ticketId) {
    currentTicketId = ticketId;
    messageArea.innerHTML = ""; // Clear previous messages
    socket.send(JSON.stringify({ action: "join-ticket", ticketId }));
  }

  // Function to display messages
  function displayMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
  }

  // Send message from admin to user
  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message && currentTicketId !== null) {
      socket.send(
        JSON.stringify({
          action: "admin-reply",
          ticketId: currentTicketId,
          message
        })
      );
      displayMessage("Admin", message);
      messageInput.value = "";
    }
  });

  // Handle WebSocket disconnects
  socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
});
