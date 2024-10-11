const { requestValidationVariables: validate } = require('../common/constants/requestValidationVariables.js')

const validateGetUserByIdRequest = [
    validate.UserId.Required.Param
]

const validateChangeUserProfileRequest = [
    validate.UserId.Required.Param,
    validate.Username.Optional.Body,
    validate.FirstName.Optional.Body,
    validate.LastName.Optional.Body,
    validate.Age.Optional.Body,
    validate.CashAmount.Optional.Body,
    validate.Email.Optional.Body,
    validate.Password.Optional.Body
]

const validateChangeUserDataRequest = [
    validate.UserId.Required.Param,
    validate.Email.Optional.Body,
    validate.Username.Optional.Body,
    validate.Password.Optional.Body
]

const validateDeleteUserRequest = [
    validate.UserId.Required.Query
]


const validateRegisterUserRequest = [
    validate.Username.Required.Body,
    validate.Email.Required.Body,
    validate.Password.Required.Body,
    validate.FirstName.Required.Body,
    validate.LastName.Optional.Body,
    validate.Age.Optional.Body,
    validate.CashAmount.Required.Body
]

const validateLoginUserRequest = [
    validate.Username.Required.Body,
    validate.Password.Required.Body
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