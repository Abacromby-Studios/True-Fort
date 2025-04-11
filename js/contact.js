
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!email || !subject || !message) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }
            
            // In a real implementation, you would send the form data to a server
            // For demonstration purposes, we'll just show a success message
            
            // Clear form
            contactForm.reset();
            
            // Show success message
            showFormMessage('Your message has been sent! We'll get back to you soon.', 'success');
        });
    }
    
    function showFormMessage(message, type) {
        const formMessage = document.getElementById('formMessage');
        
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';
            
            // Hide message after 5 seconds
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }
});
