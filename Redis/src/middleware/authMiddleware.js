require('dotenv').config()
const jwt = require('jsonwebtoken')
const { logger } = require('../common/utils/logger.js')

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        logger.info(req.userId)
        next();
    } 
    catch (err) {
        logger.error(err)
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware