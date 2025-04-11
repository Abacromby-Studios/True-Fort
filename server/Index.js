const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sendMail = require("./mailer");
const sendPush = require("./pushSender");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

let tickets = {}; // In-memory ticket store

// POST: Create a new ticket
app.post("/create-ticket", (req, res) => {
  const { email, subject, message } = req.body;
  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  const ticketId = Date.now().toString();
  const ticket = {
    id: ticketId,
    email,
    subject,
    messages: [{ from: "user", content: message }],
  };

  tickets[ticketId] = ticket;
  io.emit("new_ticket", ticket);

  res.json({ success: true, ticketId });
});

// POST: Send inactivity warning via email
app.post("/send-inactivity-warning", async (req, res) => {
  const { ticketId, email } = req.body;
  try {
    await sendMail(
      email,
      "Inactivity Warning - TrueFort Support",
      `<p>This ticket will close soon if no response is received.</p>`
    );
    res.json({ success: true, message: "Inactivity warning sent." });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send warning." });
  }
});

// POST: Send email manually
app.post("/send-mail", async (req, res) => {
  const { to, subject, html } = req.body;
  try {
    await sendMail(to, subject, html);
    res.status(200).send("Mail sent.");
  } catch (err) {
    res.status(500).send("Failed to send mail.");
  }
});

// POST: Send push notification
app.post("/send-push", async (req, res) => {
  const { subscription, payload } = req.body;
  try {
    await sendPush(subscription, payload);
    res.status(200).send("Push sent.");
  } catch (err) {
    res.status(500).send("Failed to send push.");
  }
});

// WebSocket events
io.on("connection", (socket) => {
  socket.on("user_message", ({ ticketId, message }) => {
    if (tickets[ticketId]) {
      tickets[ticketId].messages.push({ from: "user", content: message });
      io.emit("user_message", { ticketId, message });
    }
  });

  socket.on("admin_message", ({ ticketId, message }) => {
    if (tickets[ticketId]) {
      tickets[ticketId].messages.push({ from: "admin", content: message });
      io.emit("admin_message", { ticketId, message });
    }
  });

  socket.on("close_ticket", (ticketId) => {
    delete tickets[ticketId];
    io.emit("ticket_closed", ticketId);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => console.log(`Live chat server running on port ${port}`));
