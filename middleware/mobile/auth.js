const jwt = require('jsonwebtoken')

exports.verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(403).json({ error: "please provide a token" })
    }
    else {
        jwt.verify(token.split(" ")[1], process.env.THE_KEY, (err, value) => {
            if (err) {
                res.status(401).send("UnAuthorized")
                return
            }

            req.data = value
            next()
        })
    }
}

exports.sign = (user_nik, device_id) => {
    return jwt.sign({
        user_nik,
        device_id,
        iat: Math.floor(Date.now() / 1000) - 30
    }, process.env.THE_KEY)
}