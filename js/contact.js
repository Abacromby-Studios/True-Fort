document.addEventListener("DOMContentLoaded", () => {
  const generalForm = document.getElementById("general-form");
  const appealForm = document.getElementById("appeal-form");

  document.getElementById("show-general-form").addEventListener("click", () => {
    generalForm.style.display = "block";
    appealForm.style.display = "none";
  });

  document.getElementById("show-appeal-form").addEventListener("click", () => {
    generalForm.style.display = "none";
    appealForm.style.display = "block";
  });

  // Handle general contact form
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const department = document.getElementById("department").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, department, subject, message }),
      });

      if (res.ok) {
        alert("Your message has been sent.");
        contactForm.reset();
      } else {
        alert("Failed to send your message.");
      }
    } catch (error) {
      alert("An error occurred while sending your message.");
    }
  });

  // Handle ban appeal form
  const appeal = document.getElementById("appealForm");
  appeal?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("appeal-email").value;
    const username = document.getElementById("minecraft-username").value;
    const banReason = document.getElementById("ban-reason").value;
    const appealReason = document.getElementById("appeal-reason").value;

    try {
      const res = await fetch("/api/appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, banReason, appealReason }),
      });

      if (res.ok) {
        alert("Your appeal has been submitted.");
        appeal.reset();
      } else {
        alert("Failed to submit your appeal.");
      }
    } catch (error) {
      alert("An error occurred while submitting your appeal.");
    }
  });
});
