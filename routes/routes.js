const express = require("express");
const router = express.Router();
const r_ws = require('./V1/r_ws')
const { verify } = require('../middleware/auth_web')
const auth = require('../routes/V1/auth/auth')


router.use((req, res, next) => {
    next();
});


router.use('/v1/ws', r_ws);


router.use((req, res) => {
    console.log('API IN')
    if (req.err) {
        console.error(req.err)
    }
    return res.json({
        status: 200,
        isSuccess: true,
        data: null,
        message: null
    })
})

module.exports = router;