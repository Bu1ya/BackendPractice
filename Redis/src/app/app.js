require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const { sanitizeInputMiddleware } = require('../middleware/sanitizeInputMiddleware.js')
const { REQUEST_LIMITS } = require('../common/constants/constants.js')
const authRoutes = require('../routes/authRoutes.js')
const usersRoutes = require('../routes/usersRoutes.js')
const activityRoutes = require('../routes/activityRoutes.js')
const { logger } = require('../common/utils/logger.js')
const morgan = require('morgan')

const app = {
    appInstance: express(),

    initializeApp: async () => {
        const limiter = rateLimit({
            windowMs: REQUEST_LIMITS.RATE_LIMIT_DURATION_MS,
            max: REQUEST_LIMITS.MAX_REQUESTS_PER_WINDOW,
            message: REQUEST_LIMITS.MESSAGE,
        })
        
        app.appInstance.use(helmet())
        app.appInstance.use(express.json())
        app.appInstance.use(sanitizeInputMiddleware)
        app.appInstance.use(limiter)
        
        const morganFormat = ':method :url :status :response-time ms'

        app.appInstance.use(
            morgan(
                morganFormat, {
                stream: {
                write: (message) => {
                    const parts = message.trim().split(" ");
                    const logObject = {
                    method: parts[0],
                    url: parts[1],
                    status: parts[2],
                    responseTime: parts[3],
                    };
                    logger.info(JSON.stringify(logObject));
                },
                },
            })
        )

        app.appInstance.use('/users', usersRoutes)
        app.appInstance.use('/auth', authRoutes)
        app.appInstance.use('/gifts', activityRoutes)
    }
}

module.exports = { app }



