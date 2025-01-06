const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');


// =======================================================================
// ============================= GETTING DATA ===============================
// =======================================================================



exports.get_detail_pengajuan_item = async (req, res) => {
    console.log(req.query);
    req_id = req.query.req_id;

    try {
        let q = `
            select ttfd.* from tf_eappr.tf_trn_fppu_dtls ttfd
            where
                REQUEST_ID = '${req_id}'
            order by 
                ttfd.CREATED_DATE DESC, 
                ttfd.REQUEST_ID DESC
        `

        let xRes = await simpleExecute(q);

        // console.log(xRes)

        return res.status(200).json({
            isSuccess: true,
            data: xRes
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


exports.get_approval_data = async (req, res) => {
    console.log(req.query);
    req_id = req.query.req_id;

    try {
        let q = `
            select * from tf_eappr.tf_trn_approve_fppu ttaf 
            where REQUEST_ID = '${req_id}'
            order by LVL desc ;
            ;
        `

        let xRes = await simpleExecute(q);

        // console.log(xRes)

        return res.status(200).json({
            isSuccess: true,
            data: xRes
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


exports.get_file_data = async (req, res) => {
    console.log('get_file_data')
    console.log(req.query);
    req_id = req.query.req_id;

    try {

        // ===============================================================
        // ===================== GETTING THE FILE NAME ====================
        // ===============================================================
        

        let q = `
            select ttfd.* from tf_eappr.tf_trn_fppu_dtls ttfd
            where
                REQUEST_ID = '${req_id}'
            order by 
                ttfd.CREATED_DATE DESC, 
                ttfd.REQUEST_ID DESC
        `

        let xRes = await simpleExecute(q);

        file_name = xRes[0]['FILE_NAME'];
        file_path = path.join(__dirname,'..','file_storage','file_pengajuan',file_name)



        // ==============================================================
        // ===================== READING THE FILE =========================
        // ==============================================================

        const data_base64 = () => {
            try {
               return fs.readFileSync(file_path,'base64');
                // console.log(data);
            } catch (err) {
                console.error(err);
            }
        }

        

        return res.status(200).json({
            isSuccess: true,
            data: {
                file_name : file_name,
                data: data_base64()
            }
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



