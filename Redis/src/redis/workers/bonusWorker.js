const { Worker } = require('bullmq');
const redisClient = require('../redisClient')
const pool = require('../../db/pool.js')
const { logger } = require('../../common/utils/logger')

const worker = new Worker('bonusQueue', async (job) => { 
    try{
        const { userId, bonusId } = job.data;

        const client = await pool.connect()
        
        await client.query('BEGIN')
        
        await client.query('UPDATE users_profiles SET cash_amount = cash_amount + 100 WHERE user_id = $1', [userId])
        
        await client.query('UPDATE bonuses SET is_paid = $1, paid_at = CURRENT_TIMESTAMP WHERE bonus_id = $2', [true, bonusId])
    
        await client.query('COMMIT')
    
        logger.info(`Bonus with ID: ${bonusId} paid to user with ID ${userId}`)
    } catch (err) {
        logger.error('Unexpected error during completing the job:', err)
    }
}, {
    connection: redisClient,
});

module.exports = worker
