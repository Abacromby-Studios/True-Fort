document.addEventListener('DOMContentLoaded', function() {
    // Server status check
    const serverStatusDot = document.getElementById('serverStatusDot');
    const serverStatus = document.getElementById('serverStatus');
    const playerCount = document.getElementById('playerCount');
    
    if (serverStatusDot && serverStatus && playerCount) {
        checkServerStatus();
        
        // Check server status every 60 seconds
        setInterval(checkServerStatus, 60000);
    }
    
    function checkServerStatus() {
        // This is a mock function. In a real implementation, you would make an API call to check the server status.
        // For demonstration purposes, we'll randomly set the server as online or offline.
        const isOnline = Math.random() > 0.2; // 80% chance of being online
        const players = isOnline ? Math.floor(Math.random() * 50) : 0;
        const maxPlayers = 100;
        
        if (isOnline) {
            serverStatusDot.className = 'status-dot online';
            serverStatus.textContent = 'Online';
            playerCount.textContent = `${players}/${maxPlayers} players online`;
        } else {
            serverStatusDot.className = 'status-dot offline';
            serverStatus.textContent = 'Offline';
            playerCount.textContent = 'Server is currently offline';
        }
    }
    
    // Copy button functionality for individual copy buttons
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-clipboard-target');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                copyToClipboard(targetElement.value);
                showCopyNotification('Copied to clipboard!');
            }
        });
    });
    
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
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
          
