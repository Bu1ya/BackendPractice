const { param, query, body } = require('express-validator')
const { requestValidationVariables: validator } = require('../common/constants/requestValidationVariables.js')

const validateGetUserByIdRequest = [
    validator.userIdValidation(param, true)
]

const validateChangeUserProfileRequest = [
    validator.userIdValidation(query, true),
    validator.usernameValidation(body),
    validator.firstNameValidation(body),
    validator.lastNameValidation(body),
    validator.ageValidation(body),
    validator.cashAmountValidation(body),
    validator.emailValidation(body),
    validator.passwordValidation(body),
]

const validateChangeUserDataRequest = [
    validator.userIdValidation(query, true),
    validator.emailValidation(body),
    validator.usernameValidation(body),
    validator.passwordValidation(body)
]

const validateDeleteUserRequest = [
    validator.userIdValidation(query, true)
]


const validateRegisterUserRequest = [
    validator.usernameValidation(body, true),
    validator.emailValidation(body, true),
    validator.passwordValidation(body, true),
    validator.firstNameValidation(body, true),
    validator.lastNameValidation(body),
    validator.ageValidation(body),
    validator.cashAmountValidation(body, true)
]

const validateLoginUserRequest = [
    validator.usernameValidation(body, true),
    validator.passwordValidation(body, true)
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