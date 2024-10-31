const { Queue } = require('bullmq')
const redisClient = require('../redisClient.js')

const bonusQueue = new Queue('bonusQueue', {
    connection: redisClient
})

module.exports = bonusQueue