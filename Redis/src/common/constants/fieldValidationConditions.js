const genericConditions = (field) => ({

    numeric: [
        { method: 'toNumeric', args: [] },
        { method: 'isNumeric', args: [] },
        { method: 'withMessage', args: [`${field} must be a numeric`]}
    ],
    
    int: [
        { method: 'toInt', args: [] },
        { method: 'isInt', args: [] },
        { method: 'withMessage', args: [`${field} must be a integer`]}
    ],
    
    float: [
        { method: 'toFloat', args: [] },
        { method: 'isFloat', args: [] },
        { method: 'withMessage', args: [`${field} must be a float`]}
    ],
    
    string: [
        { method: 'toString', args: [] },
        { method: 'isString', args: [] },
        { method: 'withMessage', args: [`${field} must be a string`]}
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
    ]
}

module.exports = { genericConditions, uniqueConditions }


