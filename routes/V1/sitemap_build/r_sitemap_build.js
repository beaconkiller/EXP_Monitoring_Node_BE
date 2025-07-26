var express = require('express');
const router = express.Router();
const cont_sitemap_build = require('../../../controllers/V1/cont_sitemap_builder'); 


router.route('/get_project_pin')
    .get(cont_sitemap_build.get_project_pin);

router.route('/get_project_all')
    .get(cont_sitemap_build.get_project_all);

router.route('/get_sitemap_image')
    .get(cont_sitemap_build.get_sitemap_image);

module.exports = router;