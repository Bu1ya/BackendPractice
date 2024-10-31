const { logger } = require("../../common/utils/logger");

module.exports = (socket) => {
    socket.on('message', (message) => {
        logger.info(`Received message from ${socket.handshake.address}:`, message);

        socket.emit('reply', `Message received: ${message}`);
    });
}