const { logger } = require("../common/utils/logger.js")
const { initDatabase } = require("../controllers/dbController.js")

initDatabase()
.then(db => {
    db.close((err) => {
        if (err) {
            logger.error(`Error closing the database connection: ${err.message}`)
        }
        logger.info('Closed the database connection.')
    })
})
.catch(err => {
    logger.error(`Database initialization failed:`, err)
})