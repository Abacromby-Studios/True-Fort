
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(express.static('public'));

let tickets = [];

app.post('/submit-ticket', (req, res) => {
    const { email, subject, department, message } = req.body;

    const ticket = {
        id: tickets.length + 1,
        email,
        subject,
        department,
        messages: [{ sender: 'user', message }],
        status: 'open',
    };

    tickets.push(ticket);
    io.emit('new-ticket', ticket);

    res.status(201).json(ticket);
});

// Sending inactivity notice email
function sendInactivityEmail(toEmail, subject) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your.email@gmail.com',
      pass: 'your_email_password',
    }
  });

  const mailOptions = {
    from: 'TrueFort Support <your.email@gmail.com>',
    to: toEmail,
    subject: 'Your support ticket is inactive',
    text: `Hello,

We noticed you haven’t responded to your support ticket about: "${subject}".
Please reply in the live chat soon, or your ticket may be closed.

Thanks,
TrueFort Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// Socket.io connection
io.on('connection', (socket) => {
    socket.on('admin-join', () => {
        socket.emit('ticket-list', tickets);
    });

    socket.on('join-ticket', (ticketId) => {
        const ticket = tickets.find(t => t.id === ticketId);
        socket.emit('ticket-history', ticket);
    });

    socket.on('send-message', ({ ticketId, sender, message }) => {
        const ticket = tickets.find(t => t.id === ticketId);
        ticket.messages.push({ sender, message });
        io.emit('new-message', { ticketId, sender, message });
    });

    socket.on('send-inactivity-notice', ({ ticketId }) => {
        const ticket = tickets.find(t => t.id === ticketId);
        sendInactivityEmail(ticket.email, ticket.subject);
    });
});

// Run server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
