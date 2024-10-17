require('dotenv').config()
const jwt = require('jsonwebtoken')

const clientSocketAuthMiddleware = (socket, next) => {
    const token = socket.handshake.query.token

    if (!token) {
        return next(new Error('Authentication error: No token provided'))
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error: Invalid token'))
        }

        socket.user = decoded
        next()
    });
};

module.exports = clientSocketAuthMiddleware;