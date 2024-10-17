const { clientSocket } = require("../socket/clientSocket")

const clientSocketInfoMiddleware = (req, res, next) => {
    if(clientSocket.adminRights){
        clientSocket.io.emit('route-info', { route: req.originalUrl, body: req.body })
    }
    next()
}

module.exports = { clientSocketInfoMiddleware }