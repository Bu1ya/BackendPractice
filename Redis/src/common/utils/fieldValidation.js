const { body, param, query } = require('express-validator')

const fieldValidation  = (location, field, required = false, conditions = []) => {
    let validator = location(field)
    
    if (required) {
        validator = validator.notEmpty().withMessage(`${field} is required`)
    }
    else {
        validator = validator.optional()
    }

    validator = validator.trim().escape()

    conditions.forEach((condition) => {
        validator = validator[condition.method](...condition.args)
    })

    return validator
}

module.exports = { fieldValidation }