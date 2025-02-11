var express = require('express')
const router = express.Router();
const { verify, verifyMulti } = require('../../../middleware/mobile/v1/auth');
const crypt = require('../../../middleware/mobile/crypt')

const auth = require('../../../controllers/mobile/v1/auth')
const user = require('../../../controllers/mobile/v1/user')

router.route('/login_mobile')
    .post(crypt.decryptV2, auth.login);

router.route('/getuser')
    .get(verify, user.getUser)

// router.route('/check-version')
//     .get(auth.checkVersion)

module.exports = router;
