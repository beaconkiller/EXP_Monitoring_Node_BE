var express = require('express');
const router = express.Router();
const cont_sitemap_build = require('../../../controllers/V1/cont_sitemap_builder'); 


router.route('/get_project_pin')
    .get(cont_sitemap_build.get_project_pin);

router.route('/get_project_all')
    .get(cont_sitemap_build.get_project_all);

router.route('/get_sitemap_image')
    .get(cont_sitemap_build.get_sitemap_image);

router.route('/get_project_hdrs')
    .get(cont_sitemap_build.get_project_hdrs);

router.route('/get_project_pin_from_db')
    .get(cont_sitemap_build.get_project_pin_from_db);

router.route('/test')
    .get(cont_sitemap_build.test);

module.exports = router;