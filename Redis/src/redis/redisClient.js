const redis = require('redis')

let redisClient

const initializeRedisClient = async () => {    
    redisClient = redis.createClient({ 
        url: process.env.REDIS_URL 
    })
    .on("connect", () => {
        console.log("Connected to Redis successfully.")
    })
    .on("error", (err) => {
        console.error(`Failed to create the Redis client with error:`)
        console.error(err)
    })

    try{
        await redisClient.connect()
    } catch(err) {
        console.log(err)
    }
}

module.exports = { redisClient, initializeRedisClient }

