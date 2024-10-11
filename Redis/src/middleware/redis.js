const redis = require('redis');
const hash = require("object-hash");
const { json } = require('express');

let redisClient = undefined

const isRedisWorking = () => {
    return redisClient?.isOpen()
}


const requestToKey = (req) => {
    const requestDataToHash = {
        query: req.query,
        body: req.body
    }

    return `${req.path}@${hash.sha1(requestDataToHash)}`
}

const writeData = async (key, data, options) => {
    if(isRedisWorking()) {
        try{
            await redisClient.set(key, data, options)
        } catch(err) {
            console.log(err)
        }
    }
}

const readData = async (key) => {
    let cachedValue = undefined

    if(isRedisWorking()) {
        cachedValue = await redisClient.get(key)
        if(cachedValue) {
            return cachedValue
        }
    }
}

const redisCacheMiddleware = (options = { EX: 3600 }) => {
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
                    if(res.statusCode.toString().startsWith('2')) {
                        writeData(key, data, options).then()
                    }

                    return originalSend(data)
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
            url: redisURL,
            // socket: {
            //     host: process.env.REDIS_HOST,
            //     port: process.env.REDIS_PORT
            // }
        }).on('error', err => {
            console.log(err)
        })

        try{
            await redisClient.connect()
            console.log('Connected to Redis successfully.')
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = initializeRedisClient