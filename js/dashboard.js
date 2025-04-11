const socket = io();

// Hardcoded password protection
const password = prompt("Enter admin password:");
if (password !== "Alpha Lima Delta Bravo Charlie Five Five Seven Six 7639215") {
    alert("Incorrect password. Access denied.");
    document.body.innerHTML = "";
    throw new Error("Unauthorized access");
}

socket.on("new_ticket", (ticket) => {
    createTicketBox(ticket);
});

socket.on("user_message", ({ ticketId, message }) => {
    const box = document.getElementById("messages-" + ticketId);
    if (box) {
        box.innerHTML += `<div class="message"><strong>User:</strong> ${message}</div>`;
    }
});

function createTicketBox(ticket) {
    const container = document.getElementById("ticketContainer");
    const box = document.createElement("div");
    box.className = "chat-box";
    box.id = "ticket-" + ticket.id;
    box.innerHTML = `
        <h3>Ticket from ${ticket.email}</h3>
        <div class="messages" id="messages-${ticket.id}"></div>
        <div class="input-group">
            <input type="text" placeholder="Type a message..." id="input-${ticket.id}">
            <button onclick="sendMessage('${ticket.id}')">Send</button>
        </div>
        <div class="admin-controls">
            <button onclick="sendInactivityWarning('${ticket.id}', '${ticket.email}')">Send Inactivity Warning</button>
            <button onclick="closeTicket('${ticket.id}')">Close Ticket</button>
        </div>
    `;
    container.appendChild(box);
}

function sendMessage(ticketId) {
    const input = document.getElementById("input-" + ticketId);
    const msg = input.value.trim();
    if (msg) {
        socket.emit("admin_message", { ticketId, message: msg });
        const box = document.getElementById("messages-" + ticketId);
        box.innerHTML += `<div class="message"><strong>Admin:</strong> ${msg}</div>`;
        input.value = "";
    }
}

function sendInactivityWarning(ticketId, email) {
    fetch("/send-inactivity-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId, email })
    })
    .then(res => res.json())
    .then(data => alert(data.message || "Inactivity warning sent."));
}

function closeTicket(ticketId) {
    socket.emit("close_ticket", ticketId);
    const box = document.getElementById("ticket-" + ticketId);
    if (box) box.remove();
}
