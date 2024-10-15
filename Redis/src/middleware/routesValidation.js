const { param, query, body } = require('express-validator')
const { genericConditions, uniqueConditions } = require('../common/constants/fieldValidationConditions.js')
const { fieldValidation } = require('../common/utils/fieldValidation.js')


const validateGetUserByIdRequest = [
    fieldValidation(param, 'userId', true, genericConditions('userId').int)
]

const validateChangeUserProfileRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int),
    fieldValidation(body, 'firstName', false),
    fieldValidation(body, 'lastName', false),
    fieldValidation(body, 'age', false, genericConditions('age').int),
    fieldValidation(body, 'cashAmount', false, genericConditions('cashAmount').float)
]

const validateChangeUserDataRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int),
    fieldValidation(body, 'username', false),
    fieldValidation(body, 'email', false, uniqueConditions.email),
    fieldValidation(body, 'password', false, uniqueConditions.password)
]


const validateDeleteUserRequest = [
    fieldValidation(query, 'userId', true, genericConditions('userId').int)
]


const validateRegisterUserRequest = [
    fieldValidation(body, 'username', true),
    fieldValidation(body, 'email', true, uniqueConditions.email),
    fieldValidation(body, 'password', true, uniqueConditions.password),
    fieldValidation(body, 'firstName', true),
    fieldValidation(body, 'lastName', false),
    fieldValidation(body, 'age', false, genericConditions('age').int),
    fieldValidation(body, 'cashAmount', true, genericConditions('cashAmount').float)
]

const validateLoginUserRequest = [
    fieldValidation(body, 'username', true, uniqueConditions.login),
    fieldValidation(body, 'password', true, uniqueConditions.password)
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