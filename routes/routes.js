const express = require('express')
const router = express.Router()
const main = require('../controllers/main')


router.route('/login_main')
    .get(main.login_main);


router.route('/new_pengajuan')
    .post(main.new_pengajuan);


router.route('/test')
    .get(main.test);



module.exports = router