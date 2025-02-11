const rateLimit = require('express-rate-limit')

exports.rateLimiter = () => {
    return rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 10000,
        message: { message: 'You have exceeded limit!' },
        standardHeaders: true,
        legacyHeaders: false,
    })
}

exports.accountRateLimit = () => {
    return rateLimit({
        windowMs: 5 * 60 * 1000,
        max: 2,
        message: { message: 'You have exceeded limit!' },
        standardHeaders: true,
        legacyHeaders: false,
    })
}