const { body } = require("express-validator");
const { isEmail } = require("../utils/isEmail");
const { isAlphanumeric } = require("../utils/isAlphanumeric");

const genericConditions = (field) => ({
    
    int: [
        { method: 'toInt', args: [] },
        { method: 'isInt', args: [] },
        { method: 'withMessage', args: [`${field} must be a integer`]}
    ],
    
    float: [
        { method: 'toFloat', args: [] },
        { method: 'isFloat', args: [] },
        { method: 'withMessage', args: [`${field} must be a float`]}
    ]
})

const uniqueConditions = {
    
    password: [
        { method: 'isLength', args: [{ min: 6 }] },
        { method: 'withMessage', args: ['password must be at least 6 characters long']}
    ],

    email: [
        { method: 'normalizeEmail', args: [] },
        { method: 'isEmail', args: [] },
        { method: 'withMessage', args: ['email is not valid']}
    ],

    login: [
        { method: 'custom', args: [(value, { req }) => {
            if(!isAlphanumeric(value) && !isEmail(value)) {
                throw new Error('invalid input (input must be either a valid email or alphanumeric)');
            }
            return true
        }] }

    ]
}

module.exports = { genericConditions, uniqueConditions }


