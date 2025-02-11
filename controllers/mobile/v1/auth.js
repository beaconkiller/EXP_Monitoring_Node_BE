const { set_response } = require('../../../config/set_response');
const database_absensi = require('../../../services/db_e_approve');
const { ne2ee_bm } = require('../../../config/ne2ee_bm')
const { sign } = require('../../../middleware/mobile/v1/auth')

module.exports.login = async (req, res) => {
    try {
        var user_nik = req.body.user_nik;
        var password = req.body.password;
        var device_id = req.body.device_id;

        // console.log('login auth');
        if (user_nik == 'demo') {
            console.log('Masuk kesini nih 1');
            var result = await loginDemo(user_nik, password, device_id);
        }
        else {
            console.log('Masuk kesini nih 2');
            var result = await loginMain(user_nik, password, device_id);
        }

        if (result.status != 200) {
            console.log('Masuk kesini nih 3');

            return res.status(result.status).send(result.message)
        }

        var encrypted = ne2ee_bm.encryptV2(JSON.stringify(result.data), { aesKey: req.body.aesKey, publicKey: req.body.publicKey })

        return res.json(set_response(
            true,
            "Login success",
            encrypted
        ))
    }
    catch (e) {
        console.error(e);
        if (process.env.NODE_ENV == 'development') {
            res.status(500).json({ message: `${e}` })
        }
        else {
            res.status(500).json({ message: 'Internal Server Error!' })
        }
    }
}

async function loginMain(user_nik, password, device_id) {
    // Daftar NIK yang di-bypass untuk pengecekan device_id
    try {
        const bypassDeviceIdUsers = ['71004426', '71004433', '71001114', '22050472', '23040322', '21030501', '23040353'];

        // Query untuk mengecek NIK dan password
        const queryCheckNik = `
        SELECT 
            A.EMPL_CODE,
            A.EMPL_NAME,
            A.FUNC_NAME,
            A.EMPL_BRANCH,
            A.EMPL_BRANCH_NAME,
            A.FUNC_ID,
            A.IMAGE,
            B.BRANCH_LATITUDE,
            B.BRANCH_LONGITUDE,
            A.DEVICE_ID AS USER_DEVICE_ID
        FROM 
            TF_ABSENSI.MB_EMPLOYEES A 
        JOIN
            TF_ABSENSI.MB_BRANCH B
            ON A.EMPL_BRANCH = B.BRANCH_CODE
        WHERE 
            A.EMPL_CODE = :user_nik
        AND
            A.EMPL_PWD = SHA2(:password, 256)
        AND 
            A.EMPL_STATUS = 'PM'
    `;

        const bindCheckNik = { user_nik, password };

        // Eksekusi query untuk validasi NIK dan password
        const result = await database_absensi.simpleExecute(queryCheckNik, bindCheckNik);
        console.log(result);
        // Jika hasil ditemukan
        if (result.length > 0) {
            const userDeviceId = result[0].USER_DEVICE_ID;

            // Jika environment adalah production
            if (process.env.NODE_ENV === 'production') {
                // Jika device_id di database kosong, update dengan device_id yang baru
                if (!userDeviceId) {
                    const queryInsertDeviceId = `
                    UPDATE TF_ABSENSI.HR_MST_EMPLOYEES
                    SET DEVICE_ID = :device_id
                    WHERE EMPL_CODE = :user_nik
                `;

                    const resultInsert = await database_absensi.simpleExecute(queryInsertDeviceId, { device_id, user_nik });

                    if (resultInsert.rowsAffected === 0) {
                        throw new Error('Insert device ID failed');
                    }
                }
                // Jika device_id di database berbeda dan user tidak di bypass
                else if (userDeviceId !== device_id && !bypassDeviceIdUsers.includes(user_nik)) {
                    return {
                        status: 401,
                        message: 'Device Tidak Terdaftar'
                    };
                }
            }

            // Buat token
            const token = sign(user_nik, device_id);

            // Ambil nama karyawan dan formatnya
            const nameParts = result[0].EMPL_NAME.split(' ');
            let emplName = nameParts.slice(0, 2).join(' ');
            if (nameParts.length > 2) {
                emplName += ' ' + nameParts[2][0];
            }

            // Data untuk response
            const data = {
                userName: emplName,
                userNik: result[0].EMPL_CODE,
                userJob: result[0].FUNC_NAME,
                emplBranch: result[0].EMPL_BRANCH,
                emplBranchName: result[0].EMPL_BRANCH_NAME,
                branchLatitude: parseFloat(result[0].BRANCH_LATITUDE),
                branchLongitude: parseFloat(result[0].BRANCH_LONGITUDE),
                funcId: result[0].FUNC_ID,
                token,
                imagesProfil: result[0].IMAGE,
            };

            return {
                status: 200,
                message: 'Login success',
                data
            };
        } else {
            return {
                status: 401,
                message: 'NIK atau Password Salah!'
            };
        }
    } catch (e) {
        console.log(e);
    }

}