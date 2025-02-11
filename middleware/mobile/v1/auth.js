const jwt = require('jsonwebtoken')
// const { registerUserLog } = require('../../helper/logger')

exports.verify = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(401).json({ error: "Access not valid!" })
    }
    else {
        jwt.verify(token.split(" ")[1], process.env.THE_KEY_V1, (err, value) => {
            if (err) {
                res.status(401).send("Anda Belum Login!")
                return
            }

            var oneMinutes = 60; // 1 menit dalam detik
            var tenMinutes = 60 * 10; // 10 menit dalam detik
            var oneDay = ((60 * 60) * 24);
            var tenHours = 3600 * 10; // 10 jam dalam detik
            var now = Math.floor(Date.now() / 1000)
            var iat = value.iat
            var expireRange = tenHours

            /* // menghilang kan expire session login 20/07/2023 * Rabil
            var isExpire = (iat + expireRange) < now

            if (isExpire) {
                return res.status(401).send("Session Expired!")
            }
            */

            req.data = value
            // registerUserLog(req.data.user_nik)
            next()
        })
    }
}

exports.verifyMulti = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        res.status(403).json({ error: "please provide a token" })
    }
    else {
        var tokenStatus = jwt.verify(token.split(" ")[1], process.env.THE_KEY_V1, (err, value) => {
            if (err) {
                return false;
            }

            req.data = value
            // registerUserLog(req.data.user_nik)
            return true
        })

        if (tokenStatus) {
            next()
        }
        else {
            jwt.verify(token.split(" ")[1], process.env.THE_KEY_WEB_V1, (err, value) => {
                if (err) {
                    res.status(401).send("Anda belum login!")
                    return
                }

                req.data = value
                // registerUserLog(req.data.user_nik)
                next()
            })
        }
    }
}

exports.sign = (user_nik, device_id) => {
    return jwt.sign({
        user_nik,
        device_id,
        iat: Math.floor(Date.now() / 1000),
        // exp: Math.floor(Date.now() / 1000) + ((60 * 60) * 24) //menghilang kan expire session login 20/07/2023 * Rabil
        //exp: Math.floor(Date.now() / 1000) + (60) // 1 menit dalam detik
        // exp: Math.floor(Date.now() / 1000) + (3600 * 10) // 10 jam dalam detik
    }, process.env.THE_KEY_V1)
}