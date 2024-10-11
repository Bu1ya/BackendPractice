const { dbController } = require('./dbController.js')

const db = dbController.getDbConnection()

userProfileController = {
    insertUserProfile: (userProfile) => {
        return new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO users_profile (userId, firstName, lastName, age, cashAmount) 
                VALUES (?, ?, ?, ?, ?)
            `, [
                userProfile.userId,
                userProfile.firstName,
                userProfile.lastName,
                userProfile.age,
                userProfile.cashAmount
            ], (err) => {
                if (err) {
                    return reject(err)
                }
                resolve(userProfile.userId)
            })
        })
    }
}

module.exports = userProfileController