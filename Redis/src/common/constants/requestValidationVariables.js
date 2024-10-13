const { fieldValidation } = require('../utils/fieldValidation')


const userIdValidation = (location, required = false) => fieldValidation(location, 'userId', required, [
    { method: 'toInt', args: [] },
    { method: 'isInt', args: [] },
    { method: 'withMessage', args: ['User id must be an integer']}
])

const usernameValidation = (location, required = false) => fieldValidation(location, 'username', required, []);

const firstNameValidation = (location, required = false) => fieldValidation(location, 'firstName', required, []);

const lastNameValidation = (location, required = false) => fieldValidation(location, 'lastName', required, []);

const ageValidation = (location, required = false) => fieldValidation(location, 'age', required, [
    { method: 'toInt', args: [] },
    { method: 'isInt', args: [] },
    { method: 'withMessage', args: ['Age must be an integer']}
]);

const cashAmountValidation = (location, required = false) => fieldValidation(location, 'cashAmount', required, [
    { method: 'toFloat', args: [] },
    { method: 'isFloat', args: [] },
    { method: 'withMessage', args: ['Cash amount must be a number']}
]);

const passwordValidation = (location, required = false) => fieldValidation(location, 'password', required, [
    { method: 'isLength', args: [{ min: 6 }] },
    { method: 'withMessage', args: ['Password must be at least 6 characters long']}
]);

const emailValidation = (location, required = false) => fieldValidation(location, 'email', required, [
    { method: 'normalizeEmail', args: [] },
    { method: 'isEmail', args: [] },
    { method: 'withMessage', args: ['Email is not valid']}
]);

module.exports = {
    requestValidationVariables: {
        userIdValidation,
        usernameValidation,
        firstNameValidation,
        lastNameValidation,
        ageValidation,
        cashAmountValidation,
        passwordValidation,
        emailValidation
    }
}