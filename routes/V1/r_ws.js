var express = require('express');
const router = express.Router();
const contr_ws = require('../../controllers/V1/contr_ws'); 


router.route('/get_ws_clients')
    .get(contr_ws.get_ws_clients);

router.route('/test_cmd')
    .get(contr_ws.test_cmd);




    

module.exports = router;