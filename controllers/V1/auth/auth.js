const path = require('path');
const database = require('../../../services/db_sitemap');
const { Console } = require('console');
const fs = require("fs");
const { sign } = require('../../../middleware/auth_web');
const moment = require('moment');
const { encryptV2 } = require('../../../middleware/crypt'); // Import fungsi enkripsi


module.exports = { login, getUser }

async function login(req, res) {
    console.log('\n ========================== USER LOGIN ============================== \n');
    const t1 = Date.now();
    const { username, password, aesKey, iv } = req.body
    console.log("LOGIN request ->", username, aesKey, iv);

    console.log('Request body:', req.body);

    // Pastikan `req.body.aesKey` ada untuk enkripsi respons
    if (!req.body.aesKey) {
        // Jika aesKey tidak ada, kirim respons non-enkripsi karena tidak bisa dienkripsi
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - LOGIN - Requesting Connection to DB \n`);

        const qLogin = `
            select a.* from su_mst_employees a
            join su_sec_user b on a.empl_code = b.user_id 
            where b.user_id = $1
            and user_pwd = encode(digest($2, 'sha256'), 'hex')
        `;

        const bind = [username, password];
        const qRow = await database.simpleExecute(qLogin, bind);

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

        let user = qRow[0];
        const token = sign(username);
        user.TOKEN = token;

        // Respons untuk login berhasil
        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: user
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ LOGIN SUCCESSFUL');
        console.log('Token:', token);

        console.log(`${(Date.now() - t1)}ms - LOGIN - DONE`);
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


async function getUser(req, res) {
    const t1 = Date.now();
    const { username, aesKey, iv } = req.body
    console.log("GET USER request ->", username, aesKey, iv);

    console.log('Request body:', req.body);

    // Pastikan `req.body.aesKey` ada untuk enkripsi respons
    if (!req.body.aesKey) {
        // Jika aesKey tidak ada, kirim respons non-enkripsi karena tidak bisa dienkripsi
        return res.status(400).json({ isSuccess: false, message: "Missing AES key in request" });
    }

    try {
        console.log(`\n ${(Date.now() - t1)}ms - LOGIN - Requesting Connection to DB \n`);

        const qLogin = `
            select a.empl_code, a.empl_name from su_mst_employees a
            where  a.empl_code = :username
        `;

        const bind = [username];
        const qRow = await database.simpleExecute(qLogin, bind);

        let user = qRow[0];

        // Respons untuk login berhasil
        const responseData = {
            isSuccess: true,
            message: 'Success',
            data: user
        };

        const encryptedResult = encryptV2(responseData, aesKey, iv);

        console.log('✅ GET USER SUCCESSFUL');

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
