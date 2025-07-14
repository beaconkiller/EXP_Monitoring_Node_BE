const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const sendMail = require('./f_mailer')
const { log_ } = require('./f_helper')
const fs = require('fs');
const moment = require('moment');
const { send_whatsapp } = require("./f_whatsapp");


// ===============================================================
// ======================== APPROVAL KASBON ======================
// ===============================================================

exports.get_list_pengajuan = async (req, res) => {
    try {
        let q = `
            select * from tf_eappr.tf_trn_fppu_hdrs ttfd 
            order by CREATED_DATE desc        
        `

        var xRes = await simpleExecute(q)

        return res.json({
            status: 200,
            isSuccess: true,
            message: null,
            data: xRes,
        })
    } catch (error) {

        return res.json({
            status: 500,
            isSuccess: false,
            message: error,
            data: null,
        })
    }
}




