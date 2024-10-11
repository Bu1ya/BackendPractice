const redis = require('redis')
const hash = require("object-hash")

let redisClient = undefined

const isRedisWorking = () => {
    return redisClient?.isReady
}

const requestToKey = (req) => {
    const requestDataToHash = {
        query: req.query,
        body: req.body
    }

    return `${req.path}@${hash.sha1(requestDataToHash)}`
}

const writeData = async (key, data, options) => {
    if(true) {
        try{
            await redisClient.set(key, data, options)
        } catch(err) {
            console.log(err)
        }
    }
}

const readData = async (key) => {
    let cachedValue = undefined

    if(true) {
        cachedValue = await redisClient.get(key)
        if(cachedValue) {
            return cachedValue
        }
    }
}

const redisCacheMiddleware = (options = { PX: 3600 }) => {
    return async (req, res, next) => {
        if(isRedisWorking()) {
            const key = requestToKey(req)
            const cachedValue = await readData(key)

            if(cachedValue) {
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
    let redisURL = process.env.REDIS_URL

    if(redisURL) {
        redisClient = redis.createClient({ 
            url: redisURL 
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
}

module.exports = { redisCacheMiddleware, initializeRedisClient } 