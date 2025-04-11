document.addEventListener('DOMContentLoaded', function () { const contactForm = document.getElementById('contactForm'); const appealForm = document.getElementById('appealForm');

if (contactForm) { contactForm.addEventListener('submit', async function (e) { e.preventDefault();

const email = contactForm.email.value;
  const department = contactForm.department.value;
  const subject = contactForm.subject.value;
  const message = contactForm.message.value;

  const ticketId = await fetch('/api/ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, department, subject, message })
  }).then(res => res.json()).then(data => data.ticketId);

  localStorage.setItem('ticketId', ticketId);
  window.location.href = 'chat.html';
});

}

if (appealForm) { appealForm.addEventListener('submit', async function (e) { e.preventDefault();

const email = appealForm["appeal-email"].value;
  const username = appealForm["minecraft-username"].value;
  const banReason = appealForm["ban-reason"].value;
  const appealReason = appealForm["appeal-reason"].value;

  const ticketId = await fetch('/api/appeal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, banReason, appealReason })
  }).then(res => res.json()).then(data => data.ticketId);

  localStorage.setItem('ticketId', ticketId);
  window.location.href = 'chat.html';
});

} });
