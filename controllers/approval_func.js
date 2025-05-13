const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const sendMail = require('./f_mailer')
const { log_ } = require('./f_helper')
const fs = require('fs');
const moment = require('moment');
const { send_whatsapp } = require("./f_whatsapp");


// ===============================================================
// ============================ APPROVAL ===========================
// ===============================================================

exports.approval_approve = async (req, res) => {
    console.log('approval_approve')
    console.log(req.body);

    const REQ_ID = req.body.queryParams.REQ_ID;
    const EMPL_CODE = req.body.queryParams.EMPL_CODE;
    const STATUS = req.body.queryParams.STATUS;
    const REASON = req.body.queryParams.REASON;
    const FILE_NAME = req.body.queryParams.FILE_NAME;
    const FILE_DATA = req.body.queryParams.FILE_DATA;

    const arr_fails = [
        'Bukan dalam komite Approve',
        'Data sudah di approve',
        null,
        '',
        'No MSG found',
        'Pengajuan gagal',
        'Request masuk status RJ/RC'
    ]

    try {
        let q = `
            set @pesan  = '';

            call P_APPROVE_REQUEST(
                '${REQ_ID}', 
                '${EMPL_CODE}', 
                '${STATUS}', 
                '${REASON}', 
                '${FILE_NAME}',
                @pesan
            );
            select @pesan as pesan;
        `


        let xRes = await simpleExecute(q);
        let res_msg = xRes.flat().find(item => item?.pesan)?.pesan || "Pengajuan gagal";
        console.log(res_msg);

        if (arr_fails.includes(res_msg.trim())) {

            console.log('pengajuan gagal');
            return res.json({
                status: 400,
                isSuccess: true,
                data: res_msg
            })
        }



        // ===========================================================================
        // ========================= SAVING THE SIGNATURE FILE ========================
        // ===========================================================================

        save_file(FILE_DATA, FILE_NAME);


        if (STATUS == 'AP') {

            // ============================== USER APPROVED ==============================


            // ===========================================================================
            // ================== SEND EMAIL TO NEXT APPROVAL COMMITTEE  =================
            // ===========================================================================

            if (await f_is_last_person(REQ_ID, EMPL_CODE)) {

                // ===========================================================================
                // ========== IF THE USER IS THE LAST PERSON AND FINISHED THE ORDER ==========
                // ===========================================================================


                // ===========================================================================
                // ===================== GET CURRENT ORDER'S CREATOR CODE ====================
                // ===========================================================================d

                let curr_order_data = await f_get_curr_order(REQ_ID);
                let creator_code = curr_order_data[0]['EMPL_CODE'];
                let kat_request = curr_order_data[0]['KATEGORI_REQUEST']

                console.log(curr_order_data);

                let mail = curr_order_data[0]['email'];
                if (mail != null) {
                    let mail_str = `
                        <p>
                            Pengajuan anda telah selesai dengan detail berikut : 
                            <br>
                            <br>Nomor Pengajuan : ${REQ_ID}
                            <br>Judul Pengajuan : ${kat_request}
                        </p>
                        <a href="http://182.253.238.218:4026/request-dtl?id=${REQ_ID}">Go to E-Approval</a>
                    `
                    sendMail.sendMail(mail, mail_str, kat_request);
                }

                const lineBr = '%0D%0A%0D%0A'

                send_whatsapp(
                    curr_order_data[0]['NO_HP'], curr_order_data[0]['REQUEST_ID'], 
                    `Pengajuan anda telah selesai.${lineBr}` +
                    `Nomor   : ${curr_order_data[0]['REQUEST_ID']} %0D%0A` +
                    `Tanggal  : ${moment(curr_order_data[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                    `https://approval.transfinance.id/request-dtl?id=${curr_order_data[0]['REQUEST_ID']}`                
                );

                send_whatsapp(
                    curr_order_data[0]['NO_HP_2'], curr_order_data[0]['REQUEST_ID'], 
                    `Pengajuan anda telah selesai.${lineBr}` +
                    `Nomor   : ${curr_order_data[0]['REQUEST_ID']} %0D%0A` +
                    `Tanggal  : ${moment(curr_order_data[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                    `Judul      : *${curr_order_data[0]['KATEGORI_REQUEST']}* ${lineBr}` +
                    `https://approval.transfinance.id/request-dtl?id=${curr_order_data[0]['REQUEST_ID']}`                
                );

            } else {

                // ===========================================================================
                // ====================== FIND CURRENT APPROVAL COMMITTEE =====================
                // ===========================================================================

                
                var act_pengajuan = await this.search_curr_request_id(REQ_ID);
                
                console.log(act_pengajuan)
                
                if (act_pengajuan.length > 0) {
                    let mail = act_pengajuan[0]['email']
                    if (mail != null) {
                        let mail_str = `
                            <p>
                                Anda memiliki pengajuan untuk di approve dengan detail berikut : 
                                <br>
                                <br>Nomor Pengajuan : ${REQ_ID}
                                <br>Judul Pengajuan : ${act_pengajuan[0]['KATEGORI_REQUEST']}
                            </p>
                            <a href="http://182.253.238.218:4026/request-dtl?id=${REQ_ID}">Go to E-Approval</a>
                        `
                        sendMail.sendMail(mail, mail_str, act_pengajuan[0]['KATEGORI_REQUEST']);
                    }

                    const lineBr = '%0D%0A%0D%0A'

                    send_whatsapp(
                        act_pengajuan[0]['NO_HP'], act_pengajuan[0]['REQUEST_ID'], 
                        `${act_pengajuan[0]['EMPL_NAME_PEMBUAT']} meminta approve.${lineBr}` +
                        `Nomor   : ${act_pengajuan[0]['REQUEST_ID']} %0D%0A` +
                        `Tanggal  : ${moment(act_pengajuan[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                        `https://approval.transfinance.id/request-dtl?id=${act_pengajuan[0]['REQUEST_ID']}`                
                    );
    
                    send_whatsapp(
                        act_pengajuan[0]['NO_HP_2'], act_pengajuan[0]['REQUEST_ID'], 
                        `${act_pengajuan[0]['EMPL_NAME_PEMBUAT']} meminta approve.${lineBr}` +
                        `Nomor   : ${act_pengajuan[0]['REQUEST_ID']} %0D%0A` +
                        `Tanggal  : ${moment(act_pengajuan[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                        `https://approval.transfinance.id/request-dtl?id=${act_pengajuan[0]['REQUEST_ID']}`                
                    );
                }
            }

        } else if (STATUS == 'RJ') {

            // ===========================================================================
            // ====================== USER HAS REJECTED THE REQUEST ======================
            // ===========================================================================


            // ===========================================================================
            // ===================== GET CURRENT ORDER'S CREATOR CODE ====================
            // ===========================================================================d

            let curr_order_data = await f_get_curr_order(REQ_ID);
            let creator_code = curr_order_data[0]['EMPL_CODE'];
            let kat_request = curr_order_data[0]['KATEGORI_REQUEST']

            console.log(curr_order_data);

            let mail = curr_order_data[0]['email'];
            if (mail != null) {
                let mail_str = `
                    <p>
                        Pengajuan anda telah di reject dengan detail berikut : 
                        <br>
                        <br>Nomor Pengajuan : ${REQ_ID}
                        <br>Judul Pengajuan : ${kat_request}
                    </p>
                    <a href="http://182.253.238.218:4026/request-dtl?id=${REQ_ID}">Go to E-Approval</a>
                `
                sendMail.sendMail(mail, mail_str, kat_request);
            }

            const lineBr = '%0D%0A%0D%0A'

            send_whatsapp(
                curr_order_data[0]['NO_HP'], curr_order_data[0]['REQUEST_ID'], 
                `Pengajuan anda telah di reject. ${lineBr}` +
                `Nomor   : ${curr_order_data[0]['REQUEST_ID']} %0D%0A` +
                `Tanggal  : ${moment(curr_order_data[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                `https://approval.transfinance.id/request-dtl?id=${curr_order_data[0]['REQUEST_ID']}`                
            );

            send_whatsapp(
                curr_order_data[0]['NO_HP_2'], curr_order_data[0]['REQUEST_ID'], 
                `Pengajuan anda telah di reject. ${lineBr}` +
                `Nomor   : ${curr_order_data[0]['REQUEST_ID']} %0D%0A` +
                `Tanggal  : ${moment(curr_order_data[0]['CREATED_DATE'], 'YYYY-MM-DD').format("DD-MM-YYYY")} %0D%0A`+
                `https://approval.transfinance.id/request-dtl?id=${curr_order_data[0]['REQUEST_ID']}`                
            );
}


        // return res.status(200).json({
        //     isSuccess: true,
        //     data: 'res_msg'
        // })

        return res.status(200).json({
            isSuccess: true,
            data: res_msg
        })
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




exports.search_curr_request_id = async (req_id) => {
    log_('search_curr_request_id');

    let q = `
        select t1.*, ttfh.CREATED_DATE, t2.empl_code as EMPL_CODE_PEMBUAT, hme.EMPL_NAME as EMPL_NAME_PEMBUAT from(
            select T1.*, mst_e.NO_HP, mst_e.NO_HP_2 from TF_EAPPR.TF_LIST_USER_APPROVED_V T1
            join tf_absensi.hr_mst_employees mst_e on mst_e.EMPL_CODE = T1.EMPL_CODE
            where REQUEST_ID = '${req_id}'
        ) t1
        join tf_trn_approve_fppu t2 on t2.request_id = t1.request_id 
        join tf_absensi.hr_mst_employees hme on hme.EMPL_CODE = t2.EMPL_CODE 
        join tf_eappr.tf_trn_fppu_hdrs ttfh on t2.REQUEST_ID = ttfh.REQUEST_ID 
        order by t2.lvl asc limit 1;
    `

    // let q = `
    //     select T1.*, mst_e.NO_HP, mst_e.NO_HP_2 from TF_EAPPR.TF_LIST_USER_APPROVED_V T1
    //     join tf_absensi.hr_mst_employees mst_e on mst_e.EMPL_CODE = T1.EMPL_CODE
    //     where REQUEST_ID = '${req_id}';
    // `

    var xRes = await simpleExecute(q);
    return xRes;
}




save_file = (file_data, file_name) => {
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- NOTE TO FUTURE ASS SELF ----------------------------------
    // ---------------------------------------------------------------------------------------------
    // ----- BEFORE WRITING THE FILE TO DISK, SPLIT THE CONVERTED BASE64 STRING BY COMMA, THEN -----
    // ---- SELECT THE SECOND ELEMENT. CUS THATS THE REAL FILE, THE FIRST ELEMENT IS THE HEADER ---- 
    // ---- DO IT LIKE WE DID BELOW. --------------------------------------------------------------- 
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------


    let fileStorage_path = path.join(__dirname, '..', 'file_storage', 'ttd_approval')
    let fileData = file_data;
    const binary_data = Buffer.from(fileData, 'base64');

    // console.log(fileData);

    fs.writeFile(fileStorage_path + '/' + file_name, binary_data, function (err) {
        if (err) {
            console.log(err)
        }
    })

}




f_is_last_person = async (req_id, EMPL_CODE) => {
    log_('f_is_last_person')

    q = `
        select * from tf_trn_approve_fppu ttaf 
        where 
            ttaf.REQUEST_ID = '${req_id}'
        order by LVL    
    `

    var xRes = await simpleExecute(q);

    console.log(xRes);

    position = 0;
    for (let i = 0; i < xRes.length; i++) {
        curr_empl_code = xRes[i]['EMPL_CODE'];
        if (EMPL_CODE == curr_empl_code) {
            position = i;
            break;
        }
    }
    position += 1;

    console.log(`approval length : ${xRes.length}`);
    console.log(`committee position : ${position}`)


    if (position == xRes.length) {
        return true;
    } else {
        return false;
    }
}




f_get_curr_order = async (req_id) => {
    log_('f_get_curr_order')

    try {
        q = `
            select ttaf.*, hme.email, hme.NO_HP, hme.NO_HP_2, ttfh.KATEGORI_REQUEST from tf_trn_approve_fppu ttaf 
            join tf_absensi.hr_mst_employees hme on hme.EMPL_CODE = ttaf.EMPL_CODE
            join tf_eappr.tf_trn_fppu_hdrs ttfh on ttfh.REQUEST_ID = ttaf.REQUEST_ID 
            where 
                ttaf.REQUEST_ID = '${req_id}'
            order by LVL
        `

        var xRes = await simpleExecute(q);

        return xRes;
    } catch (error) {
        console.log(error);
        return false;
    }
}