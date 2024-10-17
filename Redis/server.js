const http = require('http');
const { app } = require('./src/app/app');
const { clientSocket } = require('./src/socket/clientSocket');
const { initializeRedisClient } = require('./src/redis/redisClient');
const { dbController } = require('./src/controllers/dbController');

initializeExpressServer = async () => {
    app.initializeApp()

    dbController.getDbConnection()
    
    await initializeRedisClient()
    
    const server = http.createServer(app.appInstance)

    clientSocket.initializeClientSocket(server)

    server.listen(process.env.APP_PORT, () => {
        console.log(`Server listening on port ${process.env.APP_PORT}`)
    })
}

initializeExpressServer()
    .then()
    .catch((err) => console.error(err))

process.on('SIGINT', () => {
    dbController.closeDbConnection()
})