const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userProfileController = require('../controllers/userController.js')
const checkValidationErrors = require('../middleware/checkValidationErrors.js')
const { requestAuthRoutesValidator: requestValidator } = require('../middleware/routesValidation.js')
const { isEmail } = require('../common/utils/isEmail.js')

const JWT_SECRET = process.env.JWT_SECRET

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello World!' })
})

router.post('/register',[
    requestValidator.validateRegisterUserRequest,
    checkValidationErrors
], async (req, res) =>{
    const io = req.app.locals.io;
    const { email, username, password, firstName, lastName, age, cashAmount} = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

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
    
    userProfileController.insertUser(userData, userProfileData)
    .then(() => {
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
        res.status(201).json({ message: 'User registered successfully.' })
    })
    .catch(err => {
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Registration failed.', err })
        }
    })
})

router.post('/login', [
    requestValidator.validateLoginUserRequest,
    checkValidationErrors
], async (req, res) => {
    const { username, password } = req.body
    
    try{
        const io = req.app.locals.io;
        const userData = isEmail(username) 
        ? await userProfileController.getUserByEmail(username) 
        : await userProfileController.getUserByUsername(username)

        if(!userData){
            return res.status(404).json({ error: 'User not found.' })
        }

        if(!await bcrypt.hash(password, 10) === userData.password){
            return res.status(401).json({ error: 'Invalid credentials.' })
        }

        const token = jwt.sign({ userId: userData.id, username: userData.username }, JWT_SECRET, {
            expiresIn: '1h'
        })
        
        io.emit('route-info', { route: req.originalUrl, body: req.body });
        
        res.status(200).json({ message: 'Login successful.', token })

    } catch(err){
        res.status(500).json({ error: 'Login failed.', err})
    }
})

module.exports = router

