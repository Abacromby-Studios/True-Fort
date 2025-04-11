document.addEventListener("DOMContentLoaded", () => {
  const submitButton = document.getElementById("submit-form");

  submitButton.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!email || !department || !subject || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Simulate sending data to the server
    console.log("Sending message:", { email, department, subject, message });

    // Example: redirect to chat.html with ticket (if needed)
    // window.location.href = "chat.html";

    alert("Message sent successfully!");
    document.getElementById("contact-form").reset();
  });
});
