const path = require('path');
const database = require('../../../services/db_sitemap');
const { Console } = require('console');
const fs = require("fs");
const { sign } = require('../../../middleware/auth_web');
const moment = require('moment');
const { encryptV2 } = require('../../../middleware/crypt'); // Import fungsi enkripsi


module.exports = { getTransType, getTransTypeDtl }

async function getTransType(req, res) {
    console.log('\n ========================== GET TRANS TYPE ============================== \n');
    const t1 = Date.now();
    const { username, aesKey, iv } = req.body
    console.log(req.body)
    console.log("GET TRANS TYPE request ->", username, aesKey, iv);

    console.log('Request body controllers:', req.body);

    // Pastikan `req.body.aesKey` ada untuk enkripsi respons
    if (!req.body.aesKey) {
        console.log('masuk eroorr kesini')
        // Jika aesKey tidak ada, kirim respons non-enkripsi karena tidak bisa dienkripsi
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - LOGIN - Requesting Connection to DB \n`);

        const query = `
            select * from su_mst_trans_type
        `;

        const qRow = await database.simpleExecute(query);

        if (!qRow || qRow.length === 0) {
            console.log('USER NOT FOUND or WRONG PASSWORD');
            // Respons untuk login gagal, ENKRIPSI data agar konsisten
            const responseData = {
                isSuccess: false,
                message: "Username atau password salah",
                data: null
            };
            console.log(req.body);

            const encryptedResult = encryptV2(responseData, aesKey, iv);
            return res.status(401).json({ data: encryptedResult });
        }

        let data = qRow;

        console.log(data);

        // Respons untuk login berhasil
        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: data
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ GET TRANSTYPE SUCCESSFUL');

        console.log(`${(Date.now() - t1)}ms - GET TRANSTYPE - DONE`);
        // Kirim respons terenkripsi dalam format yang sudah disepakati
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
        // Tangani error server dengan respons terenkripsi
        const encryptedResult = encryptV2(responseData, aesKey, iv);
        return res.status(500).json({ data: encryptedResult });
    }
}


async function getTransTypeDtl(req, res) {
    const t1 = Date.now();
    const { transType, aesKey, iv } = req.body
    console.log("GET TRANSTYPE DTL request ->", transType, aesKey, iv);

    console.log('Request body:', req.body);

    // Pastikan `req.body.aesKey` ada untuk enkripsi respons
    if (!req.body.aesKey) {
        // Jika aesKey tidak ada, kirim respons non-enkripsi karena tidak bisa dienkripsi
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - GET TRANSTYPE DTL - Requesting Connection to DB \n`);

        const query = `
            select FILED_NAME from su_mst_trans_type_dtl
            where TRANS_TYPE = $1
            and FLAG_COLMN = 'Y'
        `;

        const bind = [transType];
        const qRow = await database.simpleExecute(query, bind);

        let data = qRow;

        data = [
            { code: 'RV01', name: 'Receive Voucher - Cash' },
            { code: 'RV012', name: 'Receive Voucher - Online' }


        ]
        // { code: 'RV01', name: 'Receive Voucher - Cash' }



        // Respons untuk login berhasil
        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: data
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ GET TRANS TYPE DTL SUCCESSFUL');

        console.log(`${(Date.now() - t1)}ms - GET USER - DONE`);
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
        // Tangani error server dengan respons terenkripsi
        const encryptedResult = encryptV2(responseData, aesKey, iv);
        return res.status(500).json({ data: encryptedResult });
    }
}

