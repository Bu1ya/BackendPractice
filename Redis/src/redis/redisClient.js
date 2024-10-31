const redis = require('redis')
const { logger } = require('../common/utils/logger')

let redisClient

const initializeRedisClient = async () => {    
    redisClient = redis.createClient({ 
        url: process.env.REDIS_URL 
    })
    .on("connect", () => {
        logger.info("Connected to Redis successfully.")
    })
    .on("error", (err) => {
        logger.error(`Failed to create the Redis client with error:`, err)
    })

    try{
        await redisClient.connect()
    } catch(err) {
        logger.error(err)
    }
}

module.exports = { redisClient, initializeRedisClient }

