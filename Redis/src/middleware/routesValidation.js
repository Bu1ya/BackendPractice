const { param, query, body } = require('express-validator')
const { genericConditions, uniqueConditions } = require('../common/constants/fieldValidationConditions.js')
const { fieldValidation } = require('../common/utils/fieldValidation.js')


const validateGetUserByIdRequest = [
    fieldValidation(param, 'userId', true, genericConditions('userId').int)
]

const validateChangeUserProfileRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int),
    fieldValidation(body, 'firstName', false, genericConditions('firstName').string),
    fieldValidation(body, 'lastName', false, genericConditions('lastName').string),
    fieldValidation(body, 'age', false, genericConditions('age').int),
    fieldValidation(body, 'cashAmount', false, genericConditions('cashAmount').float)
]

const validateChangeUserDataRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int),
    fieldValidation(body, 'username', false, genericConditions('username').string),
    fieldValidation(body, 'email', false, genericConditions('email').string.concat(uniqueConditions.email)),
    fieldValidation(body, 'password', false, genericConditions('password').string.concat(uniqueConditions.password))
]


const validateDeleteUserRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int)
]


const validateRegisterUserRequest = [
    fieldValidation(body, 'username', true, genericConditions('username').string),
    fieldValidation(body, 'email', true, genericConditions('email').string.concat(uniqueConditions.email)),
    fieldValidation(body, 'password', true, genericConditions('password').string.concat(uniqueConditions.password)),
    fieldValidation(body, 'firstName', true, genericConditions('firstName').string),
    fieldValidation(body, 'lastName', false, genericConditions('lastName').string),
    fieldValidation(body, 'age', false, genericConditions('age').int),
    fieldValidation(body, 'cashAmount', true, genericConditions('cashAmount').float)
]

const validateLoginUserRequest = [
    fieldValidation(body, 'username', true, genericConditions('username').string),
    fieldValidation(body, 'password', true, genericConditions('password').string.concat(uniqueConditions.password))
]


module.exports = {
    requestUsersRoutesValidator: {
        validateGetUserByIdRequest,
        validateChangeUserProfileRequest,
        validateChangeUserDataRequest,
        validateDeleteUserRequest
    },

    requestAuthRoutesValidator: {
        validateRegisterUserRequest,
        validateLoginUserRequest
    }

}