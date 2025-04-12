// chat.js
document.addEventListener("DOMContentLoaded", () => {
  const socket = new WebSocket("wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1");

  // Load ticket data from localStorage
  const ticketData = JSON.parse(localStorage.getItem("ticketData"));
  const ticketId = ticketData ? ticketData.ticketId : null;
  const messageArea = document.getElementById("message-area");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-message");

  if (!ticketId) {
    alert("No ticket found. Redirecting back to contact form...");
    window.location.href = "contact.html"; // Redirect if no ticketId is found
  }

  // Connect to WebSocket
  socket.onopen = () => {
    console.log("Connected to WebSocket server");

    // Join the ticket room once connected
    socket.send(JSON.stringify({ action: "join-ticket", ticketId }));

    // Display incoming messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.ticketId === ticketId) {
        if (data.action === "admin-reply") {
          displayMessage("Admin", data.message);
        } else if (data.action === "user-reply") {
          displayMessage("You", data.message);
        }
      }
    };
  };

  // Send message to admin
  sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
      socket.send(
        JSON.stringify({
          action: "user-message",
          ticketId,
          message
        })
      );
      displayMessage("You", message);
      messageInput.value = "";
    }
  });

  // Helper function to display messages
  function displayMessage(sender, message) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight; // Scroll to the bottom
  }

  // Handle disconnects
  socket.onclose = () => {
    console.log("Disconnected from WebSocket server");
  };
});
