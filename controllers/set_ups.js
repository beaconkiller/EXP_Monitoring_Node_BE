const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
const f_helper = require('./f_helper');
const { search_curr_request_id } = require("./approval_func");
const sendMail = require("./f_mailer");
// const path = required('path')


// =======================================================================
// ============================= GETTING DATA ===============================
// =======================================================================


exports.get_suppliers = async (req, res) => {
    console.log("\n ================= get_suppliers =============== \n")

    q_page = req.query.q_page;
    q_search = req.query.q_search;

    f_paging = () => {
        let limit = 8
        let offset = (q_page-1) * limit
        return [limit, offset]
    }

    f_search = () => {
        if(q_search.trim().length > 0){
            return `
                AND (
                    SUPPLIER_NAME LIKE '%${q_search}%' 
                    OR REK_NO LIKE '%${q_search}%' 
                    OR REK_NAME LIKE '%${q_search}%'
                )
            `
        }else{
            return ``;
        }
    }

    q = `
        select * from tf_mst_supplier tms
        WHERE 
            SUPPLIER_NAME IS NOT NULL
            ${f_search()}
        LIMIT ${f_paging()[0]}
        OFFSET ${f_paging()[1]}        
    `

    var xRes = await simpleExecute(q);


    console.log(xRes);



    try {
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



// =======================================================================
// ========================= GETTING THE BANKS ===========================
// =======================================================================

exports.get_banks = async (req, res) => {
    console.log('\n ==================== exports.get_banks ==================== \n')
    console.log(req.query);

    let q = `select * from xx_mst_bank xmb order by BANK_NAME ;`;
    var xRes = await simpleExecute(q);

    // console.log(xRes);

    try {
        return res.json({
            status:200,
            isSuccess: true,
            message:'Success',
            data: xRes
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            status : 500,
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}



// =======================================================================
// =========================== UPDATE STUFFS =============================
// =======================================================================

exports.add_supplier = async (req, res) => {
    console.log('\n add_supplier \n')
    console.log(req.body);

    suppl_rek_no = req.body.suppl_rek_no;
    suppl_rek_name = req.body.suppl_rek_name;
    suppl_name = req.body.suppl_name;
    suppl_bank_name = req.body.suppl_bank_name;
    empl_code = req.body.empl_code;
    bank_code = req.body.bank_code;
    bank_name = req.body.bank_name;

    let supplier_id = bank_code+'-'+suppl_rek_no;

    console.log(supplier_id);

    try {

        // -----------------------------------------------------------------
        // ----------- CHECK IF EXISITING REKENING EXIST (REK_NO) ----------
        // -----------------------------------------------------------------

        let q_checkExist = `
            select * from tf_mst_supplier tms
            where SUPL_ID = '${supplier_id}'
        `;
        
        var xResCheck = (await simpleExecute(q_checkExist));

        if(xResCheck.length > 0){
            return res.json({
                status:409,
                isSuccess: false,
                message: 'Penambahan gagal, rekening sudah terdaftar',
                data: 'Penambahan gagal, rekening sudah terdaftar'
            })
        }



        // // -----------------------------------------------------------------
        // // ---------------- GET ID FROM FETCHING COUNT TABLE ---------------
        // // -----------------------------------------------------------------

        // let q_count = `select count(*) from tf_mst_supplier tms`;
        // var xResCount = (await simpleExecute(q_count))[0]['count(*)'];
        // console.log(xResCount);



        // ------------------------------------------------------------------
        // ------ INSERTING THE NEW SUPPLIER WITH PREVIOUSLY FETCHED ID -----
        // ------------------------------------------------------------------

        let q = `
            INSERT INTO tf_eappr.tf_mst_supplier (
                SUPL_ID,
                SUPPLIER_NAME,
                REK_NO,
                REK_NAME,
                BANK_NAME,
                IS_ACTIVE,
                CREATED_BY,
                CREATED_DATE
            )
            VALUES (
                '${supplier_id}',
                '${suppl_name}',
                '${suppl_rek_no}',
                '${suppl_rek_name}',
                '${bank_name}',
                'Y',
                '${empl_code}',
                '${(new Date()).toISOString().split('T')[0]}'
                )
        `
        var xRes = await simpleExecute(q);        
        console.log(xRes);
        // console.log(xRes.affectedRows);


        if(xRes.affectedRows >= 1){
            return res.json({
                status:200,
                isSuccess: true,
                message: 'Penambahan supplier berhasil',
                data: 'Penambahan supplier berhasil'
            })
        }else{
            return res.json({
                status:204,
                isSuccess: true,
                message: 'Penambahan supplier gagal',
                data: 'Penambahan supplier gagal'
            })
        }

    }

    catch (e) {
        console.error(e.message)
        res.status(500).json({
            isSuccess: false,
            message: e.toString(),
            data: e.toString()
        })
    }
}




exports.remove_suppl = async (req, res) => {
    console.log('\n ==================== exports.remove_suppl ==================== \n')
    console.log(req.body);

    let supl_id = req.body.supl_id;

    let q = `
        UPDATE tf_eappr.tf_mst_supplier
            SET IS_ACTIVE='N'
        WHERE 
            SUPL_ID = '${supl_id}'    
    `;

    console.log(q);

    var xRes = await simpleExecute(q);
    console.log(xRes);

    try {
        return res.json({
            status:200,
            isSuccess: true,
            message:'Success',
            data: xRes
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            status : 500,
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}




exports.update_suppl = async (req, res) => {
    console.log('\n ==================== exports.update_suppl ==================== \n')
    console.log(req.body);

    let q = `select * from xx_mst_bank xmb order by BANK_NAME`;
    var xRes = await simpleExecute(q);

    // console.log(xRes);

    try {
        return res.json({
            status:200,
            isSuccess: true,
            message:'Success',
            data: xRes
        })
    }
    catch (e) {
        console.error(e.message)
        res.status(500).json({
            status : 500,
            isSuccess: false,
            message: e.toString(),
            data: null
        })
    }
}



