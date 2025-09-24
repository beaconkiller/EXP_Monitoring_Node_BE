const path = require('path');
const database = require('../../services/db_sitemap');
const { Console } = require('console');
const fs = require("fs");
const moment = require('moment');
const { encryptV2 } = require('../../middleware/crypt');


module.exports = { getBlok, getProyek }

async function getProyek(req, res) {
    console.log('\n ========================== GET LOV PROYEK ============================== \n');
    const t1 = Date.now();
    const { aesKey, iv } = req.body

    if (!req.body.aesKey) {
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - GET LOV PROYEK - Requesting Connection to DB \n`);

        const query = `
            select proyek_id, proyek_name from ms_proyek 
            where status = 'AC'
        `;

        const result = await database.simpleExecute(query);

        let data = result;

        console.log(result);
        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: data
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ GET LOV PROYEK SUCCESSFUL');
        console.log(`${(Date.now() - t1)}ms - GET LOV PROYEK - DONE`);
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

async function getBlok(req, res) {
    console.log('\n ========================== MASTER SETUP UNIT ============================== \n');
    const t1 = Date.now();
    const { p_proyek_id, aesKey, iv } = req.body

    if (!req.body.aesKey) {
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - GET LOV BLOK - Requesting Connection to DB \n`);

        const query = `
            select blok_id, blok_name, type_blok from ms_blok 
            where proyek_id = $1
            and status = 'OP'
        `;

        const bind = [ p_proyek_id ];

        const result = await database.simpleExecute(query, bind);
        console.log(`data p_proyek_id ${p_proyek_id}`)
        console.log(`data bind nya ${bind}`)
        console.log(`data getBlok ${result}`);

        let data = result;

        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: data
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ GET LOV BLOK SUCCESSFUL');
        console.log(`${(Date.now() - t1)}ms - GET LOV BLOK - DONE`);
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




