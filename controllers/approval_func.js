const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const sendMail = require('./f_mailer')
const { log_ } = require('./f_helper')
const fs = require('fs');


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
        'Pengajuan gagal'
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

        if (arr_fails.includes(res_msg)) {
            return res.json({
                status : 400,
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

                let mail = curr_order_data[0]['email'];
                if (mail != null) {
                    let mail_str = `
                        <p>
                            Pengajuan anda telah selesai dengan detail berikut : 
                            <br>
                            <br>Nomor Pengajuan : ${REQ_ID}
                            <br>Judul Pengajuan : ${kat_request}
                        </p>
                        <a href="http://192.168.18.4:3026/">Go to E-Approval</a>
                    `
                    sendMail.sendMail(mail, mail_str);
                }
            } else {

                // ===========================================================================
                // ====================== FIND CURRENT APPROVAL COMMITTEE =====================
                // ===========================================================================

                var act_pengajuan = await this.search_curr_request_id(REQ_ID);

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
                            <a href="http://192.168.18.4:3026/">Go to E-Approval</a>
                        `
                        sendMail.sendMail(mail, mail_str);
                    }
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
                    <a href="http://192.168.18.4:3026/">Go to E-Approval</a>
                `
                sendMail.sendMail(mail, mail_str);
            }
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
        select * from TF_EAPPR.TF_LIST_USER_APPROVED_V
        where REQUEST_ID = '${req_id}';
    `

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
            select ttaf.*, hme.email, ttfh.KATEGORI_REQUEST from tf_trn_approve_fppu ttaf 
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