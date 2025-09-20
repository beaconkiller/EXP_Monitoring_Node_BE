const express = require('express');
const router = express.Router();
const { decryptV2 } = require('../../../middleware/crypt');
const { publicKey } = require('../../../middleware/crypt');
const auth = require('../../../controllers/V1/auth/auth')

router.get('/key', (req, res) => {
    // Kirim kunci publik yang dihasilkan ke klien
    return res.status(200).json({ publicKey: publicKey });
});

router.post('/login',
    decryptV2, auth.login
)

router.post('/get-user',
    decryptV2, auth.getUser
)

module.exports = router;