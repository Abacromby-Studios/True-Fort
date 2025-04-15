document.getElementById('appealForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    username: document.getElementById('username').value,
    email: document.getElementById('appeal-email').value,
    banReason: document.getElementById('ban-reason').value,
    unbanReason: document.getElementById('unban-reason').value,
    notes: document.getElementById('notes').value
  };

  const response = await fetch('/api/appeal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  alert(result.message || 'Appeal submitted successfully.');
});
