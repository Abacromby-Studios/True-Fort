document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const submitButton = document.getElementById("submit-form");

  submitButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevents any default action

    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!email || !department || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }

    console.log("Submitting form with:", { email, department, subject, message });

    // Now we will simulate ticket creation and redirect
    // Simulating sending the data to a server or using socket.io to emit a new ticket
    const ticketData = {
      email,
      department,
      subject,
      message,
    };

    // You could use a socket.emit here to send this ticket to the server and create a ticket in the dashboard
    // For example:
    // socket.emit('newTicket', ticketData);

    // For now, simulate a redirect after submitting the form
    localStorage.setItem("ticketData", JSON.stringify(ticketData)); // Store data in localStorage (you can replace this with real server-side storage)

    // Redirect to chat page
    window.location.href = "chat.html";
  });

  // Extra protection just in case someone presses Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stops all form submissions
    return false;
  });
});
