const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const UserController = require('../controllers/userController.js')
const checkValidationErrors  = require('../middleware/checkValidationErrors.js')
const verifyToken  = require('../middleware/authMiddleware.js')
const { requestUsersRoutesValidator: requestValidator } = require('../middleware/routesValidation.js')
const { redisCacheMiddleware } = require('../middleware/redis.js')
const e = require('express')



router.get('/', [
    redisCacheMiddleware(
        options = {
            EX: 10,
        }) 
], async (req, res) => {
    try {
        const io = req.app.locals.io;
        const users = await UserController.getAllUsers()
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
        res.status(200).json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to fetch users.', err })
    }
})

router.get('/:userId', [
    requestValidator.validateGetUserByIdRequest,
    checkValidationErrors,
    redisCacheMiddleware(
        options = {
            EX: 10,
        })
], async (req, res) => {
    try {
        const io = req.app.locals.io;
        const user = await UserController.getUserById(req.params.userId)

        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });

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
    const io = req.app.locals.io;
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
        await UserController.updateUserProfile(userProfile)
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
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
    const io = req.app.locals.io;
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
        await UserController.updateUserData(userData)
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
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
        const io = req.app.locals.io;
        
        await UserController.deleteUserById(req.query.userId)
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
        res.status(204).json({ message: 'User deleted.' })

    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.', err })
    }
})

module.exports = router

