document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent ? at end of URL

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!username || !email || !department || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }

    const socket = io();

    socket.emit("newTicket", {
      username,
      email,
      department,
      subject,
      message
    });

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);

    window.location.href = "chat.html";
  });
});
