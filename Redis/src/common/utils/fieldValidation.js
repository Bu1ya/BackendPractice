const { body, param, query } = require('express-validator')

const fieldValidation  = (requestDataLocation, field, required, conditions) => {
    let validator = requestDataLocation(field)
    
    validator = validator.trim().escape()
    
    if (required) {
        validator = validator.notEmpty().withMessage(`${field} is required`)
    }
    else {
        validator = validator.optional()
    }

    conditions.forEach((condition) => {
        validator = validator[condition.method](...condition.args)
    })

    return validator
}

module.exports = { fieldValidation }