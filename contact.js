document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-form");

  const piesocket = new WebSocket("wss://s14444.nyc1.piesocket.com/v3/1?api_key=UPiinnDYEtfHneH6QMpY0w1cF9JgdL8wrocbmbUV&notify_self=1");

  submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!email || !department || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }

    const ticketData = {
      type: "support-ticket",
      email,
      department,
      subject,
      message,
      timestamp: Date.now(),
    };

    // Store to localStorage for chat reference
    localStorage.setItem("ticketData", JSON.stringify(ticketData));

    if (piesocket.readyState === WebSocket.OPEN) {
      piesocket.send(JSON.stringify({ event: "new-ticket", data: ticketData }));
    } else {
      piesocket.addEventListener("open", () => {
        piesocket.send(JSON.stringify({ event: "new-ticket", data: ticketData }));
      });
    }

    // Redirect to chat interface
    window.location.href = "chat.html";
  });

  // Prevent accidental form submission with Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    return false;
  });
});
