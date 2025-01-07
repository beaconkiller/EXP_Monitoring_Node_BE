const express = require('express')
const router = express.Router()
const main = require('../controllers/main')
const new_pengajuan = require('../controllers/new_pengajuan')
const pengajuan_table = require('../controllers/pengajuan_table')
const detail_pengajuan = require('../controllers/detail_pengajuan')
const approval_func = require('../controllers/approval_func')


router.route('/login_main').get(main.login_main);


router.route('/get_rekening').get(new_pengajuan.get_rekening);
router.route('/get_request_type').get(new_pengajuan.get_request_type);
router.route('/get_user_cabang').get(new_pengajuan.get_user_cabang);
router.route('/get_appr_subarea').get(new_pengajuan.get_appr_subarea);
router.route('/get_appr_person').get(new_pengajuan.get_appr_person);
router.route('/new_pengajuan').post(new_pengajuan.new_pengajuan);

router.route('/get_table_data').get(pengajuan_table.get_table_data)
router.route('/get_table_data_approval').get(pengajuan_table.get_table_data_approval)


router.route('/get_detail_pengajuan_item').get(detail_pengajuan.get_detail_pengajuan_item)
router.route('/get_file_data').get(detail_pengajuan.get_file_data)
router.route('/get_approval_data').get(detail_pengajuan.get_approval_data)

router.route('/approval_approve').post(approval_func.approval_approve)


router.route('/test')
    .get(main.test);



module.exports = router