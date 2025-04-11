const { sendMail } = require('./email');

const ticketTimeouts = {};

const setupTicketManager = (io) => {
    io.on('connection', (socket) => {
        socket.on('start-inactivity-timer', ({ ticketId, email }) => {
            if (ticketTimeouts[ticketId]) clearTimeout(ticketTimeouts[ticketId]);

            ticketTimeouts[ticketId] = setTimeout(async () => {
                io.to(ticketId).emit('ticket-inactive');

                await sendMail(
                    email,
                    'support',
                    `Ticket #${ticketId} marked inactive`,
                    `Your support ticket #${ticketId} has been marked inactive due to no response.`
                );
            }, 5 * 60 * 1000); // 5 minutes
        });

        socket.on('clear-inactivity-timer', (ticketId) => {
            if (ticketTimeouts[ticketId]) clearTimeout(ticketTimeouts[ticketId]);
        });
    });
};

module.exports = { setupTicketManager };
