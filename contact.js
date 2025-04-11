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

    // Example redirect (disabled for now)
    // window.location.href = "chat.html";

    alert("Message submitted!");
    form.reset();
  });

  // Extra protection just in case someone presses Enter
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stops all form submissions
    return false;
  });
});
