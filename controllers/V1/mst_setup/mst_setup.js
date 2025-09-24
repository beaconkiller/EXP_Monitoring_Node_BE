const path = require('path');
const database = require('../../../services/db_sitemap');
const { Console } = require('console');
const fs = require("fs");
const { sign } = require('../../../middleware/auth_web');
const moment = require('moment');
const { encryptV2 } = require('../../../middleware/crypt');


module.exports = { mstSetupUnit }

async function mstSetupUnit(req, res) {
    console.log('\n ========================== MASTER SETUP UNIT ============================== \n');
    const t1 = Date.now();
    const {
        p_unit_name,
        p_blok_id,
        p_proyek_id,
        p_type,
        p_lb_net,
        p_lb_type,
        p_lt_sg,
        p_lt_sg_type,
        p_position_x,
        p_position_y,
        p_cash_keras,
        p_cash_bertahap,
        p_kpr_komersil,
        p_kpr_subsidi,
        p_strategis,
        p_pers_dp,
        p_min_boking,
        p_user_id,
        aesKey, iv } = req.body

    if (!req.body.aesKey) {
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - MST SETUP UNIT - Requesting Connection to DB \n`);

        const query = `
             call p_input_mst_unit(
                $1, 
                $2, 
                $3, 
                $4, 
                $5, 
                $6, 
                $7, 
                $8, 
                $9, 
                $10, 
                $11,
                $12,
                $13,
                $14,
                $15,
                $16,
                $17,
                $18,
                NULL
            )
        `;

        const bind = [
            p_unit_name,
            p_blok_id,
            p_proyek_id,
            p_type,
            p_lb_net,
            p_lb_type,
            p_lt_sg,
            p_lt_sg_type,
            p_position_x,
            p_position_y,
            p_cash_keras,
            p_cash_bertahap,
            p_kpr_komersil,
            p_kpr_subsidi,
            p_strategis,
            p_pers_dp,
            p_min_boking,
            p_user_id,
        ];

        const result = await database.simpleExecute(query, bind);

        let message = 'Success';
        if (result && result.rows && result.rows.length > 0) {
            message = result.rows[0].p_msg || 'Success';
        }
        console.log(result);
        const responseData = {
            isSuccess: true,
            message: message,
            data: null
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ MST SETUP UNIT SUCCESSFUL');
        console.log(`${(Date.now() - t1)}ms - MASTER SETUP UNIT - DONE`);
        return res.status(200).json({ data: encryptedResult });

    } catch (error) {
        console.log('\n ============= ERR ============= \n');
        console.error(error);
        console.log('\n ============= ERR ============= \n');
        const responseData = {
            isSuccess: false,
            message: 'Server Error',
            data: null
        };
        const encryptedResult = encryptV2(responseData, aesKey, iv);
        return res.status(500).json({ data: encryptedResult });
    }
}





