const createDbConnection = require('../db/createDbConnection.js');

class UserProfileController {
    constructor() {
        this.db = createDbConnection();
    }

    insertUserProfile = (userProfile) => {
        return new Promise((resolve, reject) => {
            this.db.run(`
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
                    return reject(err);
                }
                resolve(userProfile.userId);
            });
        });
    };
}

module.exports = UserProfileController;