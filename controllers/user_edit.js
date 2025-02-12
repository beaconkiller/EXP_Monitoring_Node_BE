const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');


// ===============================================================
// ============================ APPROVAL ===========================
// ===============================================================

exports.user_change_email = async (req, res) => {
    console.log('user_change_email')
    console.log(req.body)

    let empl_code = req.body['empl_code']
    let mail_to_change = req.body['mail_to_change']


    try {        
        let q = `
            UPDATE tf_absensi.hr_mst_employees
                SET EMAIL='${mail_to_change}'
                WHERE EMPL_CODE='${empl_code}'
            ;
        `

        console.log(q);
        
        var xRes = await simpleExecute(q);
        console.log(xRes);

        if(xRes.changedRows == 0 ){
            res_msg = 'Perubahan email gagal'

            return res.status(200).json({
                isSuccess: false,
                message: res_msg,
                data: res_msg
            })
        }else{
            res_msg = 'Perubahan email berhasil'

            return res.status(200).json({
                isSuccess: true,
                message: res_msg,
                data: res_msg
            })    
        }

    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}



