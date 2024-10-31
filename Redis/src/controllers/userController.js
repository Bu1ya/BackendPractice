const { logger } = require('../common/utils/logger.js')
const pool = require('../db/pool.js')

const userController = {
    insertUser: async ({ email, username, password, firstName, lastName, age, cashAmount }) => {
        try {
            let client = await pool.connect()

            await client.query('BEGIN')
    
            const userInsertQuery = `
                INSERT INTO users (email, username, password)
                VALUES ($1, $2, $3)
                RETURNING user_id
            `
            
            const userResult = await client.query(userInsertQuery, [email, username, password]);
            
            const userId = userResult.rows[0].user_id;
            
            const profileInsertQuery = `
            INSERT INTO users_profiles (user_id, email, username, first_name, last_name, age, cash_amount)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `;

            await client.query(profileInsertQuery, [userId, email, username, firstName, lastName, age, cashAmount]);
            
            await client.query('COMMIT');
            
            return userId;

        } catch (err) {
            await client.query('ROLLBACK');
            logger.error('Error during user and profile insertion:', err);
            throw { message: 'User registration failed.', error: err };
        }
    },

    getUserByEmail: async (email) => {
        try {
            let client = await pool.connect()

            const query = 'SELECT * FROM users WHERE email = $1'

            const result = await client.query(query, [email])
    
            return result.rows.length > 0 ? result.rows[0] : null
    
        } catch (err) {
            logger.error('Error fetching user by email:', err)
            throw err;
        }
    },

    getUserByUsername: async (username) => {
        try {
            let client = await pool.connect()
            
            const query = 'SELECT * FROM users WHERE username = $1'

            const result = await client.query(query, [username])
    
            return result.rows.length > 0 ? result.rows[0] : null

        } catch (err) {
            logger.error('Error fetching user by username:', err)
            throw err
        }
    },

    getUserById: async (userId) => {
        try {
            let client = await pool.connect()

            const query = 'SELECT * FROM users WHERE user_id = $1'

            const result = await client.query(query, [userId])
    
            return result.rows.length > 0 ? result.rows[0] : null
            
        } catch (err) {
            logger.error('Error fetching user by ID:', err)
            throw err
        }
    },

    getAllUsers: async () => {
        try {
            let client = await pool.connect()

            const query = 'SELECT * FROM users_profiles'

            const result = await client.query(query)
    
            return result.rows;

        } catch (err) {
            logger.error('Error fetching all users:', err);
            throw err;
        }
    },

    deleteUserById: async (userId) => {
        try {
            let client = await pool.connect()

            const query = 'DELETE FROM users WHERE user_id = $1';

            const result = await client.query(query, [userId]);
    
            return result.rowCount > 0;

        } catch (err) {
            logger.error('Error deleting user by ID:', err);
            throw err;
        }
    },

    updateUserData: async ({ userId, email, username, password }) => {
        try {
            let client = await pool.connect()

            await client.query('BEGIN');

            const userUpdates = {
                ...(email && { email }),
                ...(username && { username }),
                ...(password && { password })
            }

            const profileUpdates = {
                ...(email && { email }),
                ...(username && { username }),
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(age && { age }),
                ...(cashAmount && { cashAmount })
            }

            if (Object.keys(userUpdates).length === 0 && Object.keys(profileUpdates).length === 0) {
                return null
            }

            if (Object.keys(userUpdates).length > 0) {
                let updateFields = []
                let args = []
                let index = 1

                for (const [key, value] of Object.entries(userUpdates)) {
                    updateFields.push(`${key} = $${index}`)
                    args.push(value)
                    index++
                }

                args.push(userId)
                
                const userUpdateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = $${index}`
                await pool.query(userUpdateQuery, args)
            }

            if (Object.keys(profileUpdates).length > 0) {
                let updateFields = []
                let args = []
                let index = 1

                for (const [key, value] of Object.entries(profileUpdates)) {
                    updateFields.push(`${key} = $${index}`)
                    args.push(value)
                    index++
                }

                args.push(userId)

                const profileUpdateQuery = `UPDATE users_profiles SET ${updateFields.join(', ')} WHERE user_id = $${index}`
                await client.query(profileUpdateQuery, args)
            }

            await client.query('COMMIT')
            
            return(true)

        } catch (err) {
            await client.query('ROLLBACK')
            logger.error('Error updating user and profile:', err)
            return err
        }
    },
}

module.exports = userController