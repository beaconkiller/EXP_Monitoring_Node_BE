const express = require('express')
const router = express.Router()
const main = require('../controllers/main')
const new_pengajuan = require('../controllers/new_pengajuan')


router.route('/login_main')
    .get(main.login_main);


router.route('/new_pengajuan')
    .post(new_pengajuan.new_pengajuan);

router.route('/get_rekening').get(new_pengajuan.get_rekening)
router.route('/get_request_type').get(new_pengajuan.get_request_type)
router.route('/get_user_cabang').get(new_pengajuan.get_user_cabang)
router.route('/get_appr_subarea').get(new_pengajuan.get_appr_subarea)
router.route('/get_appr_person').get(new_pengajuan.get_appr_person)

router.route('/test')
    .get(main.test);



module.exports = router