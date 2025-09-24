const express = require('express');
const router = express.Router();
const { decryptV2 } = require('../../../middleware/crypt');
const lov = require('../../../controllers/V1/lov')

router.post('/get-proyek',
    decryptV2, lov.getProyek
)

router.post('/get-blok',
    decryptV2, lov.getBlok
)

module.exports = router;