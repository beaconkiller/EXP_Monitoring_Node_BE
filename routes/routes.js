const express = require('express')
const router = express.Router()
const main = require('../controllers/main')
const new_pengajuan = require('../controllers/new_pengajuan')
const pengajuan_table = require('../controllers/pengajuan_table')
const detail_pengajuan = require('../controllers/detail_pengajuan')
const approval_func = require('../controllers/approval_func')
const revisi_pengajuan = require('../controllers/revisi_pengajuan')
const set_ups = require('../controllers/set_ups')

const mobile = require('../routes/mobile/v1/mobile_routes')
const user_edit = require('../controllers/user_edit')

const crypt = require('../middleware/mobile/crypt')
const auth = require('../controllers/mobile/v1/auth')


router.route('/login_main').get(main.login_main);

router.use('/mobile/v1/', mobile);



// ====================================================
// ================== GET NEW PENGAJUAN ================
// ====================================================


// ====================================================
// ================== GET NEW PENGAJUAN ================
// ====================================================

router.route('/get_rekening').get(new_pengajuan.get_rekening);
router.route('/get_request_type').get(new_pengajuan.get_request_type);
router.route('/get_user_cabang').get(new_pengajuan.get_user_cabang);
router.route('/get_appr_subarea').get(new_pengajuan.get_appr_subarea);
router.route('/get_appr_person').get(new_pengajuan.get_appr_person);
router.route('/new_pengajuan').post(new_pengajuan.new_pengajuan);
router.route('/get_newest_pengajuan').get(new_pengajuan.get_newest_pengajuan);



// ====================================================
// ================== REVISI PENGAJUAN ================
// ====================================================

router.route('/get_detail_pengajuan_item_revisi').get(revisi_pengajuan.get_detail_pengajuan_item);



// ====================================================
// ================= GET DATA FOR TABLES ===============
// ====================================================

router.route('/get_table_data').get(pengajuan_table.get_table_data)
router.route('/get_table_data_approval').get(pengajuan_table.get_table_data_approval)
router.route('/get_table_data_histori').get(pengajuan_table.get_table_data_histori)



// ====================================================
// ================== DETAIL PENGAJUAN ================
// ====================================================

router.route('/get_detail_pengajuan_item').get(detail_pengajuan.get_detail_pengajuan_item);
router.route('/get_file_data').get(detail_pengajuan.get_file_data);
router.route('/get_approval_data').get(detail_pengajuan.get_approval_data);
router.route('/get_sig_img_data').get(detail_pengajuan.get_sig_img_data);



// ====================================================
// ==================== USER APPROVAL ==================
// ====================================================

router.route('/approval_approve').post(approval_func.approval_approve);



// ======================================================
// ==================== USER MANAGEMENT ==================
// ======================================================

router.route('/user_change_email').post(user_edit.user_change_email);



// ======================================================
// ======================== SET UPS ======================
// ======================================================

router.route('/get_banks').get(set_ups.get_banks);

router.route('/get_suppliers').get(set_ups.get_suppliers);
router.route('/add_supplier').post(set_ups.add_supplier);
router.route('/remove_suppl').post(set_ups.remove_suppl);
router.route('/update_suppl').post(set_ups.update_suppl);

router.route('/get_jenis_pembayaran').get(set_ups.get_jenis_pembayaran);
router.route('/add_jenis_pembayaran').post(set_ups.add_jenis_pembayaran);

router.route('/get_menu').post(set_ups.get_menu);




router.route('/tests')
    .get(main.tests);



module.exports = router