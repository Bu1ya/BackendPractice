const bcrypt = require('bcrypt')
const { Server } = require('socket.io')
const messageHandler = require('./socketHandlers/messageHandler')
const disconnectHandler = require('./socketHandlers/disconnectHandler')
const clientSocketAuthMiddleware = require('../middleware/clientSocketAuthMiddleware')
const { logger } = require('../common/utils/logger')

const clientSocket = {
    io: undefined,
    adminRights: false,

    
    initializeClientSocket: (server) => {
        clientSocket.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: false,
            }
        });
        
        clientSocket.io.use(clientSocketAuthMiddleware)
        
        clientSocket.io.on('connection', (socket) => {
            const password = socket.handshake.query.password
            
            clientSocket.adminRights = password ? password === process.env.ADMIN_SOCKET_PASSWORD : false

            if(!clientSocket.adminRights){
                logger.info('A user connected:', socket.handshake.address);
            }
            else{
                logger.info('Admin connected:', socket.handshake.address)
            }
            
            messageHandler(socket);
            disconnectHandler(socket);
        });
    }
}

module.exports = { clientSocket }
