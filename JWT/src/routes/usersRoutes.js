const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const UserController = require('../controllers/UserController.js')
const { body, param, query } = require('express-validator');
const checkValidationErrors  = require('../middleware/checkValidationErrors.js')
const verifyToken  = require('../middleware/authMiddleware.js')

const userController = new UserController()


router.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users.' })
    }
});

router.get('/:userId', [
    param('userId').isInt().withMessage('User ID must be an integer').toInt(),
    checkValidationErrors
], async (req, res) => {
    try {
        const user = await userController.getUserById(req.params.userId)
        if (!user) {
            return res.status(404).json({ error: 'User not found.' })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user.' })
    }
});

router.post('/create',[
    body('firstName').notEmpty().withMessage('First name is required').trim().escape(),
    body('lastName').optional().trim().escape(),
    body('age').optional().isInt().withMessage('Age must be an integer').toInt(),
    body('cashAmount').notEmpty().withMessage('Cash amount is required').isFloat().withMessage('Cash amount must be a number').toFloat(),
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    const { firstName, lastName, age, cashAmount } = req.body

    try {
        await userController.insertUser(firstName, lastName, age, cashAmount)
        res.status(201).json({ message: 'User created.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user.' })
    }
})

router.patch('/updateProfile',[
    query('userId').isInt().withMessage('User ID must be an integer').toInt(),
    body('firstName').optional().trim().escape(),
    body('lastName').optional().trim().escape(),
    body('age').optional().isInt().withMessage('Age must be an integer').toInt(),
    body('cashAmount').optional().isFloat().withMessage('Cash amount must be a number').toFloat(),
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    const { firstName, lastName, age, cashAmount } = req.body
    const userId = req.query.userId

    try {
        await userController.updateUserProfile(userId, firstName, lastName, age, cashAmount)
        res.status(200).json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.patch('/updateData',[
    query('userId').isInt().withMessage('User ID must be an integer').toInt(),
    body('email').optional().trim().escape(),
    body('username').optional().trim().escape(),
    body('password').optional().trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    const { email, username, password } = req.body
    const userId = req.query.userId

    try {
        await userController.updateUserData(userId, email, username, await bcrypt.hash(password, 10))
        res.status(200).json({ message: 'User info updated.' })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user.' })
    }
})

router.delete('/delete', [
    query('userId').isInt().withMessage('User ID must be an integer').toInt(),
    checkValidationErrors,
    verifyToken
], async (req, res) =>{
    try {
        await userController.deleteUserById(req.query.userId)
        res.status(204).json({ message: 'User deleted.' })
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.', err })
    }
})

module.exports = router

