require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const { rateLimit } = require('express-rate-limit')
const { sanitizeInputMiddleware } = require('../middleware/sanitizeInputMiddleware.js')
const { REQUEST_LIMITS } = require('../common/constants/constants.js')
const authRoutes = require('../routes/authRoutes.js')
const usersRoutes = require('../routes/usersRoutes.js')


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
        
        app.appInstance.use('/users', usersRoutes)
        app.appInstance.use('/auth', authRoutes)
    }
}

module.exports = { app }



