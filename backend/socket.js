let ticketCounter = 1;
const tickets = {};

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('new-ticket', (data) => {
            const ticketId = String(ticketCounter).padStart(5, '0');
            ticketCounter++;
            tickets[ticketId] = { ...data, id: ticketId, socketId: socket.id };

            socket.join(ticketId);
            io.to('admin').emit('ticket-created', tickets[ticketId]);
            socket.emit('ticket-confirmed', { ticketId });
        });

        socket.on('join-ticket', (ticketId) => {
            socket.join(ticketId);
        });

        socket.on('admin-message', ({ ticketId, message }) => {
            io.to(ticketId).emit('admin-reply', { message });
        });

        socket.on('user-message', ({ ticketId, message }) => {
            io.to(ticketId).emit('user-reply', { message });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

module.exports = { initializeSocket };
