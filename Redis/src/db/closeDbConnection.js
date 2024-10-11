const createDbConnection = require('./createDbConnection.js');

const closeDbConnection = () => {
    const db = createDbConnection();
    db.close((err) => {
        if (err) {
            console.error(err.message)
        }
        console.log('Database closed.')
        process.exit(0)
    });
};

module.exports = closeDbConnection;