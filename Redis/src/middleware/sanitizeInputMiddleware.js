const sanitizeHtml = require('sanitize-html')

const sanitizeInputMiddleware = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeHtml(req.body[key])
            }
        }
    }
    next()
}

module.exports = { sanitizeInputMiddleware }

