const http = require('http')
const { app } = require('./src/app/app')
const { clientSocket } = require('./src/socket/clientSocket')
const { initializeRedisClient } = require('./src/redis/redisClient')
const { dbController } = require('./src/controllers/dbController')
const { recoverPendingBonuses } = require('./src/recovery/recoverPendingBonuses')
const { logger } = require('./src/common/utils/logger')

initializeExpressServer = async () => {
    app.initializeApp()

    await initializeRedisClient()
    
    const server = http.createServer(app.appInstance)

    clientSocket.initializeClientSocket(server)

    server.listen(process.env.APP_PORT, () => {
        logger.info(`Server listening on port ${process.env.APP_PORT}`)
    })

    recoverPendingBonuses() 
}

initializeExpressServer()
    .then()
    .catch((err) => logger.error(err))

process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    await dbController.closeDbConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Shutting down...');
    await dbController.closeDbConnection();
    process.exit(0);
});