// appe// appeal.js
document.addEventListener("DOMContentLoaded", () => {
  const appealForm = document.getElementById("appeal-form");
  const appealButton = document.getElementById("submit-appeal");

  // Initialize PieSocket connection
  const socket = new WebSocket("wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1");

  socket.onopen = () => {
    console.log("PieSocket connection established for appeals.");
  };

  appealButton.addEventListener("click", (e) => {
    e.preventDefault();

    const username = document.getElementById("mc-username").value.trim();
    const reason = document.getElementById("ban-reason").value.trim();
    const explanation = document.getElementById("explanation").value.trim();
    const email = document.getElementById("appeal-email").value.trim();

    if (!username || !reason || !explanation || !email) {
      alert("Please fill out all appeal fields.");
      return;
    }

    const appealData = {
      type: "appeal",
      username,
      reason,
      explanation,
      email,
      timestamp: new Date().toISOString()
    };

    // Generate a ticket ID like 00001
    const ticketId = "A" + String(Date.now()).slice(-5); // Appeal ticket ID
    localStorage.setItem("ticketData", JSON.stringify({ ...appealData, ticketId }));

    // Send data via PieSocket
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        event: "new-appeal-ticket",
        data: {
          ticketId,
          ...appealData
        }
      }));
    } else {
      alert("WebSocket not connected. Please try again.");
      return;
    }

    // Redirect to chat page
    window.location.href = "chat.html";
  });

  // Prevent form submit via Enter key
  appealForm.addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
});
