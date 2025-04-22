const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
const f_helper = require('./f_helper');
const { search_curr_request_id } = require("./approval_func");
const sendMail = require("./f_mailer");
const moment = require("moment-timezone");
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

    let data = req.body.data;
    
    let SUPL_ID = data.SUPL_ID;
    let IS_ACTIVE = data.IS_ACTIVE;
    let SUPPLIER_NAME = data.SUPPLIER_NAME;

    let q_update = `
        UPDATE tf_eappr.tf_mst_supplier
        SET 
            IS_ACTIVE='${IS_ACTIVE}',
            SUPPLIER_NAME='${SUPPLIER_NAME}'
        WHERE SUPL_ID='${SUPL_ID}'
    `

    var xRes = await simpleExecute(q_update);

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




exports.get_jenis_pembayaran = async (req, res) => {
    console.log('\n ==================== exports.get_jenis_pembayaran ==================== \n')
    console.log(req.query);

    let q_page = req.query.q_page;
    let q_search = req.query.q_search;


    f_paging = () => {
        let limit = 10
        let offset = (q_page-1) * limit
        return [limit, offset]
    }

    f_search = () => {
        if(q_search != ''){
            return `
                where NAME_TYPE like "%${q_search}%"
            `;
        }else{
            return ``;
        }
    }
    
    try {

        // ---------------------------------------------------------
        // --------------- FIND ORDERS / ID NUMBERING --------------
        // ---------------------------------------------------------

        let q = `
            select * from tf_mst_type_request tmk
            ${f_search()} 
            order by NAME_TYPE
            LIMIT ${f_paging()[0]}
            OFFSET ${f_paging()[1]}        
        `;
        var xRes = await simpleExecute(q);
        

        return res.json({
            status:200,
            isSuccess: true,
            message:'Penambahan jenis pembayaran berhasil',
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




exports.add_jenis_pembayaran = async (req, res) => {
    console.log('\n ==================== exports.add_jenis_pembayaran ==================== \n')
    console.log(req.body);

    let name_type = req.body.name_type.trim().toUpperCase();
    let group_type = req.body.group_type;
    let empl_code = req.body.empl_code;
    
    
    try {

        // ---------------------------------------------------------
        // ------ MINIMAL CHECK FOR DUPLICATE / EXISTING VALUE -----
        // ---------------------------------------------------------

        let q_dupe = `
            select * from tf_mst_type_request tmk
            where NAME_TYPE = '${name_type}'
        `;
        var xRes_dupe = await simpleExecute(q_dupe);

        console.log(xRes_dupe.length);

        if(xRes_dupe.length > 0){
            return res.json({
                status:409,
                isSuccess: false,
                message:'Data sudah ada.',
                data: 'Data sudah ada.'    
            })            
        }

        
        

        // ---------------------------------------------------------
        // --------------- FIND ORDERS / ID NUMBERING --------------
        // ---------------------------------------------------------

        let q_count = `select count(*) from tf_mst_type_request tmk`;
        var xRes_count = await simpleExecute(q_count);
    
        let r_count = String(parseInt(xRes_count[0]['count(*)'])+1).padStart(4, '0');    
        
        
        
        
        // ---------------------------------------------------------
        // --------------- FIND ORDERS / ID NUMBERING --------------
        // ---------------------------------------------------------
        
        const dateValue = moment().tz('Asia/Jakarta').format('YYYY-MM-DD');
        let q = `
            INSERT INTO tf_eappr.tf_mst_type_request (
                id_type,
                NAME_TYPE,
                group_type,
                is_active,
                created_by,
                created_date
            )
            VALUES (
                'REQ${r_count}',
                '${name_type}',
                '${group_type}',
                'AC',
                '${empl_code}',
                '${dateValue}'
            )        
        `;

        var xRes = await simpleExecute(q);
        
        console.log(xRes.affectedRows);

        if(xRes.affectedRows == 1){
            return res.json({
                status:200,
                isSuccess: true,
                message:'Penambahan jenis pembayaran berhasil',
                data: 'Penambahan jenis pembayaran berhasil'    
            })
        }else{
            return res.json({
                status:204,
                isSuccess: true,
                message:'Penambahan jenis pembayaran gagal',
                data: 'Penambahan jenis pembayaran gagal'    
            })            
        }
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




exports.get_menu = async (req, res) => {
    console.log('\n ==================== exports.get_menu ==================== \n')
    console.log(req.body);

    
    
    try {

        let q = `
            select * from tf_mst_menu tmm
            order by MENU_LVL
        `;
        var xRes = await simpleExecute(q);
        
        console.log(xRes);

        return res.json({
            status:200,
            isSuccess: true,
            message:'getMenu success',
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


