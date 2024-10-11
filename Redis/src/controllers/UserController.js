const createDbConnection = require('../db/createDbConnection.js');
const UserProfileController = require('./UserProfileController.js');

const db =  createDbConnection()

const UserController = {
    insertUser: async (user, userProfile) => {
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO users (email, username, password) VALUES (?, ?, ?)`, 
                [user.email, user.username, user.password], (err) => {
                    if (err) {
                        console.log(err);
                        return reject({ message: 'User registration failed.', error: err });
                    }
                    
                    console.log(user)

                    db.get('SELECT userId FROM users WHERE username = ?', 
                        [user.username], (err, row) => {
                            if (err) {
                                return reject({ message: 'Failed to fetch user ID.', error: err });
                            }

                            userProfile.userId = row.userId;

                            UserProfileController.insertUserProfile(userProfile)
                                .then(() => resolve(row.userId))
                                .catch(err => reject({ message: 'Failed to insert user profile.', error: err }));
                        });
                });
        })
    },


    getUserByEmail: async (email) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if(err){
                    return reject(err)
                }
                if(row){
                    resolve(row)
                }
                else{
                    resolve(null)
                }
            })
        })
    },

    getUserByUsername: async (username) => {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if(err){
                    return reject(err)
                }
                if(row){
                    resolve(row)
                }
                else{
                    resolve(null)
                }
            })
        })
    },

    getAllUsers: async () => {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM users', (err, rows) => {
                if(err){
                    return reject(err)
                }
                resolve(rows)
            })
        })
    },

    deleteUserById: async (userId) => {
        return new Promise((resolve, reject) => {
            db.run(`DELETE FROM users WHERE userId = ?`, [userId], (err) => {
                if (err) {
                    return reject(err)
                }
                if (this.changes === 0) {
                    return resolve(null)
                }
                resolve(true)
            });
        });
    },

    updateUserData: async (userId, email, username, password) => {
        return new Promise((resolve, reject) => {
            const updates = {
                ...(email && { email }),
                ...(username && { username }),
                ...(password && { age }),
                userId
            };
    
            if (Object.keys(updates).length === 0) {
                return resolve(null)
            }
    
            let updateFields = []
            let args = []
    
            for (const [key, value] of Object.entries(updates)) {
                updateFields.push(`${key} = ?`)
                args.push(value);
            }
    
            const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE userId = ?`
            args.push(userId)
    
            db.run(sql, args, (err) => {
                if (err) {
                    return reject(err)
                }
                if (this.changes === 0) {
                    return resolve(null)
                }
                resolve(true)
            });
        });
    },

    updateUserProfile: async (userId, firstName, lastName, age, cashAmount) => {
        return new Promise((resolve, reject) => {
            const updates = {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(age && { age }),
                ...(cashAmount && { cashAmount }),
                userId
            };
    
            if (Object.keys(updates).length === 0) {
                return resolve(null)
            }
    
            let updateFields = []
            let args = []
    
            for (const [key, value] of Object.entries(updates)) {
                updateFields.push(`${key} = ?`)
                args.push(value);
            }
    
            const sql = `UPDATE users_profile SET ${updateFields.join(', ')} WHERE userId = ?`
            args.push(userId)
    
            db.run(sql, args, (err) => {
                if (err) {
                    return reject(err)
                }
                if (this.changes === 0) {
                    return resolve(null)
                }
                resolve(true)
            });
        });
    }
}

module.exports = UserController;