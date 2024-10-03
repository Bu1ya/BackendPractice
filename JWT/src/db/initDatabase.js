require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const initDatabase = () => {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database(process.env.DB_PATH, (err) => {
            if (err) {
                console.error(`Error connecting to the database: ${err.message}`);
                return reject(err);
            }
            console.log('Connected to the database.');

            db.run(`CREATE TABLE IF NOT EXISTS users (
                userId INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )`, (err) => {
                if (err) {
                    return reject(err);
                }
            });
            db.run(`CREATE TABLE IF NOT EXISTS users_profile (
                userId INTEGER PRIMARY KEY,
                firstName TEXT NOT NULL,
                lastName TEXT,
                age INTEGER,
                cashAmount BIGINT NOT NULL
            )`, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve(db);
            });
        });
    });
};

initDatabase()
    .then(db => {
        db.close((err) => {
            if (err) {
                console.error(`Error closing the database connection: ${err.message}`);
            }
            console.log('Closed the database connection.');
        });
    })
    .catch(err => {
        console.error(`Database initialization failed: ${err.message}`);
    });

module.exports = initDatabase;
