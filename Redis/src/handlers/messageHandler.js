module.exports = (socket) => {
    socket.on('message', (message) => {
        console.log(`Received message from ${socket.id}:`, message);

        socket.emit('reply', `Message received: ${message}`);
    });
}