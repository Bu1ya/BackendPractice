const { dbController } = require('./dbController.js')

const db = dbController.getDbConnection()

userProfileController = {
    insertUserProfile: ({ userId, firstName, lastName, age, cashAmount }) => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users_profile (userId, firstName, lastName, age, cashAmount) 
                VALUES (?, ?, ?, ?, ?)
            `, [userId, firstName, lastName, age, cashAmount], (err) => {
                if (err) {
                    return reject(err)
                }
                resolve(userId)
            })
        })
    }
}

module.exports = userProfileController