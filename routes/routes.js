const express = require("express");
const router = express.Router();
const r_sitemap = require('./V1/sitemap_build/r_sitemap_build')
const r_setup_project = require('./V1/r_setup_project')
const { verify } = require('../middleware/auth_web')
const auth = require('../routes/V1/auth/auth')
const rv = require('../routes/V1/rv/rv-input')
const mst = require('../routes/V1/mst_setup/mst_setup')
const lov = require('../routes/V1/lov/lov')


router.use((req, res, next) => {
    next();
});


router.use('/v1/auth', auth);
router.use('/v1/rv', rv);
router.use('/v1/mst_setup', mst);
router.use('/v1/lov', lov);


router.use('/v1/sitemap_build', r_sitemap);
router.use('/v1/setup_project', r_setup_project);


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