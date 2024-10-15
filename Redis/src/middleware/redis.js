const redis = require('redis')
const hash = require("object-hash")

let redisClient

const requestToKey = (req) => {
    const requestDataToHash = {
        query: req.query,
        body: req.body
    }

    return `${req.path}@${hash.sha1(requestDataToHash)}`
}

const writeData = async (key, data, options) => {
    if(redisClient?.isReady) {
        try{
            await redisClient.set(key, data, options)
        } catch(err) {
            console.log(err)
        }
    }
}

const readData = async (key) => {
    let cachedValue

    if(redisClient?.isReady) {
        cachedValue = await redisClient.get(key)
        if(cachedValue) {
            return cachedValue
        }
    }
}

const redisCacheMiddleware = (options = { PX: 3600 }) => {
    return async (req, res, next) => {
        if(redisClient?.isReady) {
            const key = requestToKey(req)
            const cachedValue = await readData(key)

            if(cachedValue) {
                res.set('X-Data-Cached', true)
                try{
                    return res.send(JSON.parse(cachedValue))
                } catch {
                    return res.send(cachedValue)
                }
            } else {
                const originalSend = res.send
                res.send = async (data) => {
                    res.send = originalSend

                    if(res.statusCode.toString().startsWith('2')) {
                        writeData(key, data, options).then()
                    }

                    res.set('X-Data-Cached', false)
                    
                    return res.send(data)
                }
            }
            next()
        }
        else {
            next()
        }
    }
}


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

module.exports = { redisCacheMiddleware, initializeRedisClient } 