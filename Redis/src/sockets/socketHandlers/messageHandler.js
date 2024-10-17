module.exports = (socket) => {
    socket.on('message', (message) => {
        console.log(`Received message from ${socket.handshake.address}:`, message);

        socket.emit('reply', `Message received: ${message}`);
    });
}