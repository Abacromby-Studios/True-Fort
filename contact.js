document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission

            // Collect form data
            const email = document.getElementById('email').value;
            const department = document.getElementById('department').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (email && department && subject && message) {
                console.log("Form submitted:", { email, department, subject, message });
                // You can add your logic to send the form data to the server or handle it here
            } else {
                alert("Please fill out all required fields.");
            }
        });
    }
});
