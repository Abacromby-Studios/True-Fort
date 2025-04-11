document.addEventListener('DOMContentLoaded', function () {
  const appealForm = document.getElementById('appealForm');

  if (appealForm) {
    appealForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const data = {
        email: appealForm["appeal-email"].value,
        username: appealForm["minecraft-username"].value,
        banReason: appealForm["ban-reason"].value,
        appealReason: appealForm["appeal-reason"].value
      };

      const response = await fetch('/api/appeal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('ticketId', result.ticketId);
        window.location.href = 'chat.html';
      }
    });
  }
});
  
