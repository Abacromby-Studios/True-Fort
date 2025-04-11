let ticketCounter = 1;
const tickets = {};

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // Event to create a new ticket
        socket.on('new-ticket', (data) => {
            const ticketId = String(ticketCounter).padStart(5, '0');
            ticketCounter++;
            tickets[ticketId] = { ...data, id: ticketId, socketId: socket.id };

            socket.join(ticketId); // Join the room with the ticketId
            io.to('admin').emit('ticket-created', tickets[ticketId]); // Notify admin about the new ticket
            socket.emit('ticket-confirmed', { ticketId }); // Send confirmation back to user
        });

        // Event for admin to send a message to the user
        socket.on('admin-message', ({ ticketId, message }) => {
            io.to(ticketId).emit('admin-reply', { message }); // Send the message to the user's chat
        });

        // Event for user to send a message to the admin
        socket.on('user-message', ({ ticketId, message }) => {
            io.to(ticketId).emit('user-reply', { message }); // Send the message to the admin's chat
        });

        // Admin joins the ticket room
        socket.on('join-ticket', (ticketId) => {
            socket.join(ticketId); // Join the specific ticket room
        });

        // Event when a user disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = { initializeSocket };
