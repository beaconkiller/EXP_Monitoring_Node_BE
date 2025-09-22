const express = require('express');
const router = express.Router();
const { decryptV2 } = require('../../../middleware/crypt');
// const { publicKey } = require('../../../middleware/crypt');
const rv = require('../../../controllers/V1/rv/rv-input')

// router.get('/key', (req, res) => {
//     // Kirim kunci publik yang dihasilkan ke klien
//     return res.status(200).json({ publicKey: publicKey });
// });

router.post('/get-transtype',
    decryptV2, rv.getTransType
)

router.post('/get-transtype-dtl',
    decryptV2, rv.getTransTypeDtl
)

module.exports = router;