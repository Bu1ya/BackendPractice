const { logger } = require('../common/utils/logger');
const pool = require('../db/pool');
require('dotenv').config()

const initDatabase = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await pool.connect();

            await client.query('BEGIN')

            await client.query(`
                CREATE TABLE IF NOT EXISTS users (
                    user_id SERIAL PRIMARY KEY,
                    email TEXT NOT NULL UNIQUE,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL
                )
            `)

            await client.query(`
                CREATE TABLE IF NOT EXISTS users_profiles (
                    user_id INTEGER PRIMARY KEY,
                    firstName TEXT NOT NULL,
                    lastName TEXT,
                    age INTEGER,
                    cashAmount BIGINT NOT NULL,
                    CONSTRAINT fk_user
                        FOREIGN KEY(userId) 
                        REFERENCES users(userId)
                )
            `)

            await client.query(`
                CREATE TABLE IF NOT EXISTS bonuses (
                    bonus_id SERIAL PRIMARY KEY,
                    user_id INT NOT NULL,
                    bonus_amount INT NOT NULL DEFAULT 100,
                    is_paid bool NOT NULL DEFAULT false,
                    scheduled_at TIMESTAMPTZ NOT NULL,
                    paid_at TIMESTAMPTZ
                )
            `)

            await client.query('COMMIT')

            logger.info('Connected and initialized the database.');
            client.release();
            resolve(pool);
        } catch (err) {
            logger.error(`Error initializing database: ${err.message}`);
            reject(err);
        }
    });
};


const dbController = {
    getDbConnection: () => pool,
    closeDbConnection: async () => {
        try {
            await pool.end();
            logger.info('PostgreSQL pool has been closed.');
        } catch (err) {
            logger.error('Error closing the database pool:', err.message);
        }
    }
};

module.exports = { dbController, initDatabase }
