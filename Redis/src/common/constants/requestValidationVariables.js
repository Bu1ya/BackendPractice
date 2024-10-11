const { body, param, query } = require('express-validator');


const UserId = {
    Required: {
        Param: param('userId').notEmpty().trim().escape().toInt().isInt().withMessage('User ID must be an integer'),
        Query: query('userId').notEmpty().trim().escape().toInt().isInt().withMessage('User ID must be an integer'),
        Body: body('userId').notEmpty().trim().escape().toInt().isInt().withMessage('User ID must be an integer'),
    },

    Optional: {
        Param: param('userId').optional().trim().escape().toInt().isInt().withMessage('User ID must be an integer'),
        Query: query('userId').optional().trim().escape().toInt().isInt().withMessage('User ID must be an integer'),
        Body: body('userId').optional().trim().escape().toInt().isInt().withMessage('User ID must be an integer')
    }
}

const Username = {
    Required: {
        Param: param('username').notEmpty().withMessage('Username is required').trim().escape(),
        Query: query('username').notEmpty().withMessage('Username is required').trim().escape(),
        Body: body('username').notEmpty().withMessage('Username is required').trim().escape()
    },

    Optional: {
        Param: param('username').optional().trim().escape(),
        Query: query('username').optional().trim().escape(),
        Body: body('username').optional().trim().escape()
    }
}

const FirstName = {
    Required: {
        Param: param('firstName').trim().escape().notEmpty().withMessage('First name is required'),
        Query: query('firstName').trim().escape().notEmpty().withMessage('First name is required'),
        Body: body('firstName').trim().escape().notEmpty().withMessage('First name is required'),
    },

    Optional: {
        Param: param('firstName').optional().trim().escape(),
        Query: query('firstName').optional().trim().escape(),
        Body: body('firstName').optional().trim().escape()
    }
    
}

const LastName = {
    Required: {
        Param: param('lastName').notEmpty().withMessage('Last name is required').trim().escape(),
        Query: query('lastName').notEmpty().withMessage('Last name is required').trim().escape(),
        Body: body('lastName').notEmpty().withMessage('Last name is required').trim().escape()
    },

    Optional: {
        Param: param('lastName').optional().trim().escape(),
        Query: query('lastName').optional().trim().escape(),
        Body: body('lastName').optional().trim().escape()
    }

}

const Age = {
    Required: {
        Param: param('age').notEmpty().withMessage('Age is required').trim().escape().toInt().isInt().withMessage('Age is required and must be an integer'),
        Query: query('age').notEmpty().withMessage('Age is required').trim().escape().toInt().isInt().withMessage('Age is required and must be an integer'),
        Body: body('age').notEmpty().withMessage('Age is required').trim().escape().toInt().isInt().withMessage('Age is required and must be an integer')       
    },

    Optional: {
        Param: param('age').optional().trim().escape().toInt().isInt().withMessage('Age must be an integer'),
        Query: query('age').optional().trim().escape().toInt().isInt().withMessage('Age must be an integer'),
        Body: body('age').optional().trim().escape().toInt().isInt().withMessage('Age must be an integer')
    },
}

const CashAmount = {
    Required: {
        Param: param('cashAmount').notEmpty().withMessage('Cash amount is required').trim().escape().toFloat().isFloat().withMessage('Cash amount is required and must be a number'),
        Query: query('cashAmount').notEmpty().withMessage('Cash amount is required').trim().escape().toFloat().isFloat().withMessage('Cash amount is required and must be a number'),
        Body: body('cashAmount').notEmpty().withMessage('Cash amount is required').trim().escape().toFloat().isFloat().withMessage('Cash amount is required and must be a number')
    },

    Optional: {
        Param: param('cashAmount').optional().trim().escape().toFloat().isFloat().withMessage('Cash amount must be a number'),
        Query: query('cashAmount').optional().trim().escape().toFloat().isFloat().withMessage('Cash amount must be a number'),
        Body: body('cashAmount').optional().trim().escape().toFloat().isFloat().withMessage('Cash amount must be a number'),
    }
}

const Password = {
    Required: {
        Param: param('password').notEmpty().withMessage('Password is required').trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        Query: query('password').notEmpty().withMessage('Password is required').trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        Body: body('password').notEmpty().withMessage('Password is required').trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    },

    Optional: {
        Param: param('password').optional().trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        Query: query('password').optional().trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        Body: body('password').optional().trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    }
}

const Email = {
    Required: {
        Param: param('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Email is not valid'),
        Query: query('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Email is not valid'),
        Body: body('email').notEmpty().withMessage('Email is required').normalizeEmail().isEmail().withMessage('Email is not valid')
    },

    Optional: {
        Param: param('email').optional().normalizeEmail().isEmail().withMessage('Email is not valid'),
        Query: query('email').optional().normalizeEmail().isEmail().withMessage('Email is not valid'),
        Body: body('email').optional().normalizeEmail().isEmail().withMessage('Email is not valid'),
    }
}

module.exports = {
    requestValidationVariables: {
        UserId,
        Username,
        FirstName,
        LastName,
        Age,
        CashAmount,
        Password,
        Email
    }
}