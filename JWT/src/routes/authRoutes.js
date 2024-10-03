const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserController = require('../controllers/UserController.js')
const { body, param, query } = require('express-validator');
const checkValidationErrors  = require('../middleware/checkValidationErrors.js')
const { isEmail } = require('../utils/isEmail.js')

const JWT_SECRET = process.env.JWT_SECRET

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello World!' })
})

router.post('/register',[
    body('email').isEmail().withMessage('Email is required').normalizeEmail(),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('firstName').notEmpty().withMessage('First name is required').trim().escape(),
    body('lastName').optional().trim().escape(),
    body('age').optional().isInt().withMessage('Age must be an integer').toInt(),
    body('cashAmount').notEmpty().withMessage('Cash amount is required').isFloat().withMessage('Cash amount must be a number').toFloat(),
    checkValidationErrors
], async (req, res) =>{
    console.log(req.body)
    const { email, username, password, firstName, lastName, age, cashAmount} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const userController = new UserController()

    const userData = {
        email, 
        username, 
        password: hashedPassword
    }

    const userProfileData = {
        firstName,
        lastName: lastName ? lastName : null,
        age: age ? age : null,
        cashAmount
    }
    

    userController.insertUser(userData, userProfileData)
    .then(userId => {
        console.log('User ID:', userId);
        res.status(201).json({ message: 'User registered successfully.' })
    })
    .catch(err => {
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Registration failed.', err });
        }
    });
})

router.post('/login', [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    checkValidationErrors
], async (req, res) => {
    const { username, password } = req.body
    const userController = new UserController()
    
    try{
        const userData = isEmail(username) 
        ? await userController.getUserByEmail(username) 
        : await userController.getUserByUsername(username)

        if(!userData){
            return res.status(404).json({ error: 'User not found.' })
        }

        if(!await bcrypt.hash(password, 10) === userData.password){
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userId: userData.id, username: userData.username }, JWT_SECRET, {
            expiresIn: '1h'
        })

        res.status(200).json({ message: 'Login successful.', token })
    } catch(err){
        res.status(500).json({ error: 'Login failed.' })
    }
})

module.exports = router;

