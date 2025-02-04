const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');


// =======================================================================
// ============================= GETTING DATA ===============================
// =======================================================================



exports.get_detail_pengajuan_item = async (req, res) => {
    console.log("get_detail_pengajuan_item")
    console.log(req.query.data);
    req_id = req.query.data;

    try {
        let q = `
            select ttfd.* from tf_trn_fppu_dtls ttfd 
            where
                REQUEST_ID = '${req_id}'
            order by 
                ttfd.CREATED_DATE DESC, 
                ttfd.REQUEST_ID DESC
        `

        console.log(q)

        let xRes = await simpleExecute(q);

        console.log(xRes)

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


