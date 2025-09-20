const express = require("express");
const router = express.Router();
const r_sitemap = require('./V1/sitemap_build/r_sitemap_build')
const { verify } = require('../middleware/auth_web')

const auth = require('../routes/V1/auth/auth')

router.use((req, res, next) => {
    next();
});

router.use('/v1/auth', auth);


router.use('/v1/sitemap_build', r_sitemap);

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