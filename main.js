document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const nav = document.querySelector('nav ul');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            nav.classList.toggle('show');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.guide-tab');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                
                // Remove active class from all buttons and tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to current button and tab
                button.classList.add('active');
                document.getElementById(`${tabId}-guide`).classList.add('active');
            });
        });
    }
    
    // Copy IP functionality
    const copyJavaIpBtn = document.getElementById('copyJavaIp');
    const copyBedrockIpBtn = document.getElementById('copyBedrockIp');
    
    if (copyJavaIpBtn) {
        copyJavaIpBtn.addEventListener('click', () => {
            const javaIp = document.getElementById('javaIp');
            copyToClipboard(javaIp.value);
            showCopyNotification('Java IP copied to clipboard!');
        });
    }
    
    if (copyBedrockIpBtn) {
        copyBedrockIpBtn.addEventListener('click', () => {
            const bedrockIp = document.getElementById('bedrockIp');
            const bedrockPort = document.getElementById('bedrockPort');
            copyToClipboard(`${bedrockIp.value}:${bedrockPort.value}`);
            showCopyNotification('Bedrock IP and port copied to clipboard!');
        });
    }
    
    // Copy to clipboard function
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Show copy notification
    function showCopyNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
});
