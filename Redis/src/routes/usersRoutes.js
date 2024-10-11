const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const UserController = require('../controllers/userController.js')
const checkValidationErrors  = require('../middleware/checkValidationErrors.js')
const verifyToken  = require('../middleware/authMiddleware.js')
const { requestUsersRoutesValidator: requestValidator } = require('../middleware/routesValidation.js')
const { redisCacheMiddleware } = require('../middleware/redis.js')



router.get('/', redisCacheMiddleware(
    options = {
      EX: 10,
    }
  ), async (req, res) => {
    try {
        const users = await UserController.getAllUsers()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' })
    }
})

router.get('/:userId', [
    requestValidator.validateGetUserByIdRequest,
    checkValidationErrors,
    redisCacheMiddleware(
        options = {
          EX: 10,
        }
      )
], async (req, res) => {
    try {
        const user = await UserController.getUserById(req.params.userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user.', err})
    }
})

router.patch('/updateProfile',[
    requestValidator.validateChangeUserProfileRequest,
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    const { firstName, lastName, age, cashAmount } = req.body
    const userId = req.query.userId

    try {
        await UserController.updateUserProfile(userId, firstName, lastName, age, cashAmount)
        res.status(200).json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.patch('/updateData',[
    requestValidator.validateChangeUserDataRequest, 
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    const { email, username, password } = req.body
    const userId = req.query.userId

    try {
        await UserController.updateUserData(userId, email, username, await bcrypt.hash(password, 10))
        res.status(200).json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.delete('/delete', [
    requestValidator.validateDeleteUserRequest,
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    try {
        await UserController.deleteUserById(req.query.userId)
        res.status(204).json({ message: 'User deleted.' })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.', err })
    }
})

module.exports = router

