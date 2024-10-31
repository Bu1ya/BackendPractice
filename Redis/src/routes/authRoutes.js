const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = require('../controllers/userController.js')
const checkValidationErrorsMiddleware = require('../middleware/checkValidationErrorsMiddleware.js')
const { requestAuthRoutesValidator: requestValidator } = require('../middleware/routesValidationMiddleware.js')
const { isEmail } = require('../common/utils/isEmail.js')
const { clientSocketInfoMiddleware } = require('../middleware/clientSocketInfoMiddleware.js')
const { logger } = require('../common/utils/logger.js')

const JWT_SECRET = process.env.JWT_SECRET

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Hello World!' })
})

router.post('/register',[
    requestValidator.validateRegisterUserRequest,
    checkValidationErrorsMiddleware,
    clientSocketInfoMiddleware
], async (req, res) =>{
    const { email, username, password, firstName, lastName, age, cashAmount } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)

    const userData = {
        email, 
        username, 
        password: hashedPassword,
        firstName,
        lastName: lastName ? lastName : null,
        age: age ? age : null,
        cashAmount
    }
    
    userController.insertUser(userData)
    .then(() => {
        logger.info('User registered')
        res.status(201).json({ message: 'User registered successfully.' })
    })
    .catch(err => {
        logger.error(err)
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Registration failed.', err })
        }
    })
})

router.post('/login', [
    requestValidator.validateLoginUserRequest,
    checkValidationErrorsMiddleware,
    clientSocketInfoMiddleware
], async (req, res) => {
    const { username, password } = req.body
    
    try{
        const userData = isEmail(username) 
        ? await userController.getUserByEmail(username) 
        : await userController.getUserByUsername(username)

        if(!userData){
            return res.status(404).json({ error: 'User not found.' })
        }

        if(!await bcrypt.hash(password, 10) === userData.password){
            return res.status(401).json({ error: 'Invalid credentials.' })
        }

        const token = jwt.sign({ userId: userData.user_id, username: userData.username }, JWT_SECRET, {
            expiresIn: '1h'
        })
        
        res.status(200).json({ message: 'Login successful.', token })

    } catch(err){
        logger.error(err)
        res.status(500).json({ error: 'Login failed.', err})
    }
})

module.exports = router

