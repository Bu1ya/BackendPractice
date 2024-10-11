const { body, param, query } = require('express-validator');


const validateUserId = {
    Required: {
        Param: param('userId').notEmpty().isInt().withMessage('User ID must be an integer').toInt(),
        Query: query('userId').notEmpty().isInt().withMessage('User ID must be an integer').toInt(),
        Body: body('userId').notEmpty().isInt().withMessage('User ID must be an integer').toInt(),
    },

    Optional: {
        Param: param('userId').optional().isInt().withMessage('User ID must be an integer').toInt(),
        Query: query('userId').optional().isInt().withMessage('User ID must be an integer').toInt(),
        Body: body('userId').optional().isInt().withMessage('User ID must be an integer').toInt()
    }

}

const validateFirstName = {
    Required: {
        Param: param('firstName').notEmpty().withMessage('First name is required').trim().escape(),
        Query: query('firstName').notEmpty().withMessage('First name is required').trim().escape(),
        Body: body('firstName').notEmpty().withMessage('First name is required').trim().escape(),
    },

    Optional: {
        Param: param('firstName').optional().trim().escape(),
        Query: query('firstName').optional().trim().escape(),
        Body: body('firstName').optional().trim().escape()
    }
    
};

const validateLastName = {
    Required: {
        Param: param('lastName').notEmpty().withMessage('First name is required').trim().escape(),
        Query: query('lastName').notEmpty().withMessage('First name is required').trim().escape(),
        Body: body('lastName').notEmpty().withMessage('First name is required').trim().escape()
    },

    Optional: {
        Param: param('lastName').optional().trim().escape(),
        Query: query('lastName').optional().trim().escape(),
        Body: body('lastName').optional().trim().escape()
    }

};

const validateAge = {
    Required: {
        Param: param('age').notEmpty().isInt().withMessage('Age is required and must be an integer').toInt(),
        Query: query('age').notEmpty().isInt().withMessage('Age is required and must be an integer').toInt(),
        Body: body('age').notEmpty().isInt().withMessage('Age is required and must be an integer').toInt()        
    },

    Optional: {
        Param: param('age').optional().isInt().withMessage('Age must be an integer').toInt(),
        Query: query('age').optional().isInt().withMessage('Age must be an integer').toInt(),
        Body: body('age').optional().isInt().withMessage('Age must be an integer').toInt()
    },
};

const validateCashAmount = {
    Required: {
        Param: param('cashAmount').notEmpty().isFloat().withMessage('Cash amount is required and must be a number').toFloat(),
        Query: query('cashAmount').notEmpty().isFloat().withMessage('Cash amount is required and must be a number').toFloat(),
        Body: body('cashAmount').notEmpty().isFloat().withMessage('Cash amount is required and must be a number').toFloat()
    },

    Optional: {
        Param: param('cashAmount').optional().isFloat().withMessage('Cash amount must be a number').toFloat(),
        Query: query('cashAmount').optional().isFloat().withMessage('Cash amount must be a number').toFloat(),
        Body: body('cashAmount').optional().isFloat().withMessage('Cash amount must be a number').toFloat(),
    }
    
};


const validateFirstNameRequired = body('firstName').notEmpty().withMessage('First name is required').trim().escape()

const validateFirstNameOptional = body('firstName').optional().trim().escape()

const validateLastNameOptional = body('lastName').optional().trim().escape()

const validateAgeOptional = body('age').optional().isInt().withMessage('Age must be an integer').toInt()

const validateCashAmountOptional = body('cashAmount').optional().isFloat().withMessage('Cash amount must be a number').toFloat()


module.exports = {
    validateUserId,
    validateFirstNameRequired,
    validateFirstNameOptional,
    validateLastNameOptional,
    validateAgeOptional,
    validateCashAmountOptional
};