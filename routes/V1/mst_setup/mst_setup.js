const express = require('express');
const router = express.Router();
const { decryptV2 } = require('../../../middleware/crypt');
const mst = require('../../../controllers/V1/mst_setup/mst_setup')

router.post('/setup-unit',
    decryptV2, mst.mstSetupUnit
)

module.exports = router;