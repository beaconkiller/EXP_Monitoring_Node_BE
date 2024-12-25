const express = require('express')
const router = express.Router()

const test = require('../controllers/test')

router.route('/test')
    .get(test.test_call);


module.exports = router