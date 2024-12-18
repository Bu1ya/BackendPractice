const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const userController = require('../controllers/userController.js')
const checkValidationErrorsMiddleware  = require('../middleware/checkValidationErrorsMiddleware.js')
const authMiddleware  = require('../middleware/authMiddleware.js')
const { requestUsersRoutesValidator: requestValidator } = require('../middleware/routesValidationMiddleware.js')
const { redisCacheMiddleware } = require('../middleware/redisCacheMiddleware.js')
const { clientSocketInfoMiddleware } = require('../middleware/clientSocketInfoMiddleware.js')
const { logger } = require('../common/utils/logger.js')


router.get('/', [
    redisCacheMiddleware(
        options = {
            EX: 10,
        }),
    clientSocketInfoMiddleware
], async (req, res) => {
    try {
        const users = await userController.getAllUsers()

        res.status(200).json(users)

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Failed to fetch users.', err })
    }
})

router.get('/:userId', [
    requestValidator.validateGetUserByIdRequest,
    checkValidationErrorsMiddleware,
    redisCacheMiddleware(
        options = {
            EX: 10,
        }),
    clientSocketInfoMiddleware
], async (req, res) => {
    try {
        const user = await userController.getUserById(req.params.userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }

        res.status(200).json(user)

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Failed to fetch user.', err})
    }
})

router.patch('/updateProfile',[
    requestValidator.validateChangeUserProfileRequest,
    checkValidationErrorsMiddleware,
    authMiddleware,
    clientSocketInfoMiddleware
], async (req, res) =>{
    const { firstName, lastName, age, cashAmount } = req.body
    const userId = req.query.userId
    const userProfile = {
        userId,
        firstName,
        lastName,
        age,
        cashAmount
    }

    try {
        await userController.updateUserProfile(userProfile)
        
        res.status(200).json({ message: 'User info updated.' })

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.patch('/updateData',[
    requestValidator.validateChangeUserDataRequest, 
    checkValidationErrorsMiddleware,
    authMiddleware,
    clientSocketInfoMiddleware
], async (req, res) =>{
    const { email, username, password } = req.body
    const userId = req.query.userId
    const hashedPassword = await bcrypt.hash(password, 10)
    const userData = {
        userId,
        email,
        username,
        hashedPassword
    }

    try {    
        await userController.updateUserData(userData)
        
        res.status(200).json({ message: 'User info updated.' })

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.delete('/delete', [
    requestValidator.validateDeleteUserRequest,
    checkValidationErrorsMiddleware,
    authMiddleware,
    clientSocketInfoMiddleware
], async (req, res) =>{
    try {
        await userController.deleteUserById(req.query.userId)
        
        res.status(204).json({ message: 'User deleted.' })

    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: 'Failed to delete user.', err })
    }
})

module.exports = router

