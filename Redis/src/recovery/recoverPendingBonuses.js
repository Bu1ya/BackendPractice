const { formatDateTime } = require("../common/utils/formatDateTime");
const { logger } = require("../common/utils/logger");
const { timeDifference } = require("../common/utils/timeDifference");
const pool = require("../db/pool");
const bonusQueue = require("../redis/queues/bonusQueue");

const recoverPendingBonuses = async () => {
    const pendingBonuses = await pool.query('SELECT * FROM bonuses WHERE is_paid = $1', [false]);

	pendingBonuses.rows.forEach(async (bonus) => {
        const currentTime = formatDateTime(new Date(Date.now()).toLocaleString('en-US', { hour12: false }))
        const delay = timeDifference(bonus.scheduled_at, currentTime)
        
        try {
            const { user_id, bonus_id } = bonus
            await bonusQueue.add(
                'bonusJob', 
                { user_id, bonus_id }, 
                {
                    delay,
                    jobId: `job_${bonus.bonus_id}`,
                    removeOnComplete: true,
                    removeOnFail: true
                }
            )
        } catch(err) {
            if (err.message.includes("Job with the given ID already exists")) {
                logger.info(`Job with the ID: job_${bonus.bonus_id} already exists`);
            } else {
                logger.error('Error when restoring a job:', err);
            }
        }

    })
}

module.exports = { recoverPendingBonuses }