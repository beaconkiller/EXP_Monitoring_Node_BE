const oracledb = require('oracledb');
const path = require('path');
const database_edu = require('../../../services/db_ora_ordmgmt');
const { Console } = require('console');
const fs = require("fs");
const { sign } = require('../../../middleware/auth');
const { jsonMap, jsonMap_3 } = require("../../../helper/jsonMap");
const moment = require('moment');


module.exports = {
    login,
}


async function login(req, res) {
    console.log('\n ========================== USER LOGIN ============================== \n');
    const t1 = Date.now();
    const usn = req.body.usn;
    const passW = req.body.pass;

    console.log('Request body:', req.body);

    try {
        console.log(`\n ${(Date.now() - t1)}ms - LOGIN - Requesting Connection to DB \n`);

        const qLogin = `
            SELECT t_login.*, tmo.office_type 
            FROM TF_LIST_USER_LOGIN_V t_login
            JOIN TF_MST_OFFICES tmo ON tmo.OFFICE_CODE = T_LOGIN.EMPL_BRANCH 
            WHERE 
                FUNC_NAME != 'CMO (CREDIT MARKETING OFFICER)'
                AND COY_ID = '01'
                AND EMPL_CODE = '${usn}'
        `;

        const qRow = await database_edu.simpleExecute_oracle(qLogin);

        // console.table(qRow.rows); // atau gunakan JSON.stringify(qRow, null, 2)

        if (!qRow || qRow.length === 0) {
            console.log('❌ USER NOT FOUND');
            return res.json({ isSuccess: false, message: "Username doesn't exist" });
        }

        let user = qRow.rows[0]; // hanya ambil satu user (asumsi unique)
        console.log(user.EMPL_PWD_EN)
        if (passW !== user.EMPL_PWD_EN) {
            console.log('❌ WRONG PASSWORD');
            return res.json({ isSuccess: false, message: "Wrong password" });
        }

        // ✅ Generate JWT Token
        const token = sign(usn);
        user.TOKEN = token;

        console.log('✅ LOGIN SUCCESSFUL');
        console.log('Token:', token);

        console.log(`${(Date.now() - t1)}ms - LOGIN - DONE`);
        return res.json({
            isSuccess: true,
            message: 'Success',
            data: user // kirim satu user saja atau array jika ingin
        });

    } catch (error) {
        console.log('\n ============= ERR ============= \n');
        console.error(error);
        console.log('\n ============= ERR ============= \n');
        return res.status(500).json({ isSuccess: false, message: 'Server Error', error: error.message });
    }
}


