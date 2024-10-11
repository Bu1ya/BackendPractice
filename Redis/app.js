require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')

const { sanitizeInput } = require('./src/middleware/sanitizeInput.js')
const { initializeRedisClient }  = require("./src/middleware/redis.js")
const { REQUEST_LIMITS } = require('./src/common/constants/constants.js')
const { dbController } = require('./src/controllers/dbController.js')
const authRoutes = require('./src/routes/authRoutes.js')
const usersRoutes = require('./src/routes/usersRoutes.js')


initializeExpressServer = async () => {
    app = express()

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

    app.listen(process.env.APP_PORT, () => {
        console.log(`Server listening on port ${process.env.APP_PORT}`)
    })
}

initializeExpressServer()
    .then()
    .catch((err) => console.error(err))

process.on('SIGINT', () => {
    dbController.closeDbConnection()
})