const express = require('express')
const authMiddleware = require('../middleware/authMiddleware');
const bonusQueue = require('../redis/queues/bonusQueue.js');
const { formatDateTime } = require('../common/utils/formatDateTime.js');
const pool = require('../db/pool.js');
const { logger } = require('../common/utils/logger.js');
require('../redis/workers/bonusWorker.js')
const router = express.Router()

router.get('/bonus', [ 
    authMiddleware
],  async (req, res) => {
    const { userId } = req

    try {
        const client = await pool.connect()

        const scheduledAt = new Date(Date.now() + 10 * 1000).toLocaleString('en-US', { hour12: false })

        const result = await client.query(
            'INSERT INTO bonuses (user_id, is_paid, scheduled_at) VALUES ($1, $2, $3) RETURNING bonus_id::text AS bonus_id',
            [userId, false, scheduledAt]
        )

        const bonusId = result.rows[0].bonus_id

        logger.info(`bonus ID: ${bonusId}`)

        await bonusQueue.add('bonusJob', 
            { userId, bonusId }, 
            {
                delay: 10000,
                jobId: `job_${bonusId}`,
                removeOnComplete: true,
                removeOnFail: true
            }
        )

        logger.info(`Bonus with bonus ID: ${bonusId} added to the queue.`)

        res.json({ message: 'The bonus will be credited after 10 seconds.' })

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Error occured during creating a bonus', err })
    }
})

module.exports = router