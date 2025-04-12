// dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const dashboardSection = document.getElementById("dashboard-section");
  const passwordInput = document.getElementById("admin-password");
  const loginButton = document.getElementById("login-button");

  loginButton.addEventListener("click", async () => {
    const password = passwordInput.value.trim();

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        initializeDashboard();
      } else {
        alert("Incorrect password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  });

  function initializeDashboard() {
    const socket = new WebSocket("wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1");
    const ticketList = document.getElementById("ticket-list");
    const messageArea = document.getElementById("message-area");
    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-message");

    let currentTicketId = null;

    socket.onopen = () => {
      console.log("Connected to WebSocket server");

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

    function displayTicket(ticketId, subject, email) {
      const ticketItem = document.createElement("div");
      ticketItem.classList.add("ticket");
      ticketItem.innerHTML = `<strong>Ticket #${ticketId}:</strong> ${subject} - ${email}`;
      ticketItem.addEventListener("click", () => {
        loadTicket(ticketId);
      });
      ticketList.appendChild(ticketItem);
    }

    function loadTicket(ticketId) {
      currentTicketId = ticketId;
      messageArea.innerHTML = "";
      socket.send(JSON.stringify({ action: "join-ticket", ticketId }));
    }

    function displayMessage(sender, message) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
      messageArea.appendChild(messageDiv);
      messageArea.scrollTop = messageArea.scrollHeight;
    }

    sendButton.addEventListener("click", () => {
      const message = messageInput.value.trim();
      if (message && currentTicketId !== null) {
        socket.send(
          JSON.stringify({
            action: "admin-reply",
            ticketId: currentTicketId,
            message,
          })
        );
        displayMessage("Admin", message);
        messageInput.value = "";
      }
    });

    socket.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };
  }
});
