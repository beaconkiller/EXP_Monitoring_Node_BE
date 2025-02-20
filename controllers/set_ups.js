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

    console.log(req.query);

    let xRes = [
        {
            REK_NAME : 'Aldi',
            BANK_NAME : 'BCA',
            REK_NUM : '1231231010',
        },
        {
            REK_NAME : 'Suro',
            BANK_NAME : 'BRI',
            REK_NUM : '4591267584',
        },
        {
            REK_NAME : 'Stuart',
            BANK_NAME : 'Bank Sinarmas',
            REK_NUM : '8478275619',
        },
        {
            REK_NAME : 'Doni',
            BANK_NAME : 'BRI',
            REK_NUM : '8478745619',
        },
    ] 


    arr_filtered = () => {
        new_arr = [];

        xRes.forEach(el => {
            new_str = `${el['BANK_NAME']} - ${el['REK_NAME']} - ${el['REK_NUM']}`
            new_arr.push(new_str)
        });

        return new_arr;
    }


    try {
        return res.status(200).json({
            isSuccess: true,
            data: arr_filtered()
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


    try {

        // -----------------------------------------------------------------
        // ----------- CHECK IF EXISITING REKENING EXIST (REK_NO) ----------
        // -----------------------------------------------------------------

        let q_checkExist = `
            select * from tf_mst_supplier tms
            where REK_NO = '${suppl_rek_no}'
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



        // -----------------------------------------------------------------
        // ---------------- GET ID FROM FETCHING COUNT TABLE ---------------
        // -----------------------------------------------------------------

        let q_count = `select count(*) from tf_mst_supplier tms`;
        var xResCount = (await simpleExecute(q_count))[0]['count(*)'];
        console.log(xResCount);



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
                '${xResCount}',
                '${suppl_name}',
                '${suppl_rek_no}',
                '${suppl_rek_name}',
                '${suppl_bank_name}',
                'Y',
                '${empl_code}',
                '${(new Date()).toISOString().split('T')[0]}'
                )
        `
        var xRes = await simpleExecute(q);        
        console.log(xRes);
        // console.log(xRes.affectedRows);


        if(xRes.affectedRows != 0){
            return res.json({
                status:204,
                isSuccess: true,
                message: 'Success',
                data: 'Penambahan supplier gagal'
            })
        }else{
            return res.json({
                status:200,
                isSuccess: true,
                message: 'Success',
                data: 'Penambahan supplier berhasil'
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



