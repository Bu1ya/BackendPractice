require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const http = require('http');
const { Server } = require('socket.io');

const { sanitizeInput } = require('./src/middleware/sanitizeInput.js')
const { initializeRedisClient }  = require("./src/middleware/redis.js")
const { REQUEST_LIMITS } = require('./src/common/constants/constants.js')
const { dbController } = require('./src/controllers/dbController.js')
const authRoutes = require('./src/routes/authRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')
const messageHandler = require('./src/handlers/messageHandler.js')
const disconnectHandler = require('./src/handlers/disconnectHandler.js')

initializeExpressServer = async () => {
    const app = express()
    
    app.use(helmet())
    app.use(express.json())
    app.use(sanitizeInput)
    
    dbController.getDbConnection()
    
    const limiter = rateLimit({
        windowMs: REQUEST_LIMITS.RATE_LIMIT_DURATION_MS,
        max: REQUEST_LIMITS.MAX_REQUESTS_PER_WINDOW,
        message: REQUEST_LIMITS.MESSAGE,
    })
    
    app.use(limiter)
    
    await initializeRedisClient()
    
    app.use('/users', usersRoutes)
    app.use('/auth', authRoutes)
    
    const server = http.createServer(app)

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        
        messageHandler(socket)
        disconnectHandler(socket)
    })

    server.listen(process.env.APP_PORT, () => {
        console.log(`Server listening on port ${process.env.APP_PORT}`)
    })
}

initializeExpressServer()
    .then()
    .catch((err) => console.error(err))

process.on('SIGINT', () => {
    dbController.closeDbConnection()
})