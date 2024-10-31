const { logger } = require("../../common/utils/logger")

module.exports = (socket) => {
    socket.on('disconnect', () => {
        logger.info('User disconnected:', socket.id)
    })
}