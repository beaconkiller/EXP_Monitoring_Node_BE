const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const sendMail = require('./f_mailer')
const fs = require('fs');


// ===============================================================
// ============================ APPROVAL ===========================
// ===============================================================

exports.approval_approve = async (req, res) => {
    console.log('approval_approve')

    const REQ_ID = req.body.queryParams.REQ_ID;
    const EMPL_CODE = req.body.queryParams.EMPL_CODE;
    const STATUS = req.body.queryParams.STATUS;
    const REASON = req.body.queryParams.REASON;
    const FILE_NAME = req.body.queryParams.FILE_NAME;
    const FILE_DATA = req.body.queryParams.FILE_DATA;

    const arr_fails = [
        'Bukan dalam komite Approve'
    ]

    try {        
        // let q = `
        //     set @pesan  = '';

        //     call P_APPROVE_REQUEST(
        //         '${REQ_ID}', 
        //         '${EMPL_CODE}', 
        //         '${STATUS}', 
        //         '${REASON}', 
        //         '${FILE_NAME}',
        //         @pesan
        //     );
        //     select @pesan as pesan;
        // `

        
        // let xRes = await simpleExecute(q);
        // let res_msg = xRes.flat().find(item => item?.pesan)?.pesan || "No MSG found";
        // console.log(res_msg);

        // if(arr_fails.includes(res_msg)){
        //     return res.status(200).json({
        //         isSuccess: true,
        //         data: res_msg
        //     })
        // }



        // ===========================================================================
        // ========================= SAVING THE SIGNATURE FILE ========================
        // ===========================================================================
    
        save_file(FILE_DATA, FILE_NAME);



        // ===========================================================================
        // ====================== FIND CURRENT APPROVAL COMMITTEE =====================
        // ===========================================================================

        var curr_approval = await search_curr_request_id(REQ_ID);



        // ===========================================================================
        // =================== SEND EMAIL TO NEXT APPROVAL COMMITTEE  ==================
        // ===========================================================================

        if(curr_approval.length > 0){
            let mail = curr_approval[0]['email']
            if(mail != null){
                let mail_str = `
                <p>
                    Anda memiliki pengajuan untuk di approve dengan detail berikut : 
                    <br>
                    <br>Nomor Pengajuan : ${REQ_ID}
                    <br>Judul Pengajuan : ${curr_approval[0]['KATEGORI_REQUEST']}
                </p>
                <a href="http://192.168.18.4:3026/">Go to E-Approval</a>
                `

                sendMail.sendMail(mail, mail_str);
            }
        }
        

        
        return res.status(200).json({
            isSuccess: true,
            data: 'res_msg'
        })
        
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


exports.search_curr_request_id = async(req_id) => {
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
    let fileData =  file_data;
    const binary_data = Buffer.from(fileData, 'base64');

    // console.log(fileData);

    fs.writeFile(fileStorage_path + '/' + file_name, binary_data, function (err) {
        if (err) {
            console.log(err)
        }
    })

}