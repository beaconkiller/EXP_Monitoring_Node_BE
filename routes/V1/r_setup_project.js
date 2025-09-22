var express = require('express');
const router = express.Router();
const cont_setup_project = require('../../controllers/V1/cont_setup_project'); 


router.route('/inp_new_project')
    .post(cont_setup_project.inp_new_project);

router.route('/get_project_all')
    .get(cont_setup_project.get_project_all);

router.route('/inp_new_blok')
    .post(cont_setup_project.inp_new_blok);

router.route('/get_all_blok')
    .get(cont_setup_project.get_all_blok);

    

module.exports = router;