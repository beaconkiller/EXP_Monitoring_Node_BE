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


exports.get_rekening = async (req, res) => {
    console.log('\n ============ get_rekening ========== \n')
    console.log(req.query);

    // let xRes = [
    //     {
    //         REK_NAME : 'Aldi',
    //         BANK_NAME : 'BCA',
    //         REK_NUM : '1231231010',
    //     },
    //     {
    //         REK_NAME : 'Suro',
    //         BANK_NAME : 'BRI',
    //         REK_NUM : '4591267584',
    //     },
    //     {
    //         REK_NAME : 'Stuart',
    //         BANK_NAME : 'Bank Sinarmas',
    //         REK_NUM : '8478275619',
    //     },
    //     {
    //         REK_NAME : 'Doni',
    //         BANK_NAME : 'BRI',
    //         REK_NUM : '8478745619',
    //     },
    // ] 


    q = 'select * from tf_mst_supplier tms'
    var xRes = await simpleExecute(q);
    console.log(xRes);


    arr_filtered = () => {
        new_arr = [];

        xRes.forEach(el => {
            new_str = `${el['BANK_NAME']} - ${el['REK_NAME']} - ${el['SUPPLIER_NAME']} - ${el['REK_NO']}`
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



exports.get_request_type = async (req, res) => {

    try {
        let q = `
            select * from tf_mst_type_request tmk
            order by NAME_TYPE
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



exports.get_appr_person = async (req, res) => {

    console.log(req.query);

    empl_branch = req.query['EMPL_BRANCH'];
    empl_job = req.query['ACT_JOB'];
    empl_subarea = req.query['empl_subarea'];


    try {
        let q = `
            select * from tf_eappr.tf_list_user_approve_v tluav 
                where 
                    personal_subarea = '${empl_subarea}'
                    and job_name = '${empl_job}'
            order by job_name 
        `

        // console.log(q)

        // let q = `
        //     select distinct personal_subarea, empl_branch, cabang from hr_join_office_v where empl_branch = ${empl_branch} order by cabang
        // `

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



exports.get_appr_subarea = async (req, res) => {

    empl_branch = req.query.empl_branch
    empl_subarea = req.query.empl_subarea

    try {
        let q = `
            select distinct personal_subarea, job_name from tf_eappr.tf_list_user_approve_v tluav 
            where 
                -- empl_branch = '${empl_branch}'
                personal_subarea = '${empl_subarea}'
                and job_name is not null
            order by job_name 
        `
        // console.log(q);
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




exports.get_user_cabang = async (req, res) => {
    empl_branch = req.query.EMPL_BRANCH;
    personal_subarea = req.query.personal_subarea;

    // console.log(req.query)
    // console.log([
    //     empl_branch,
    //     personal_subarea,
    // ])

    const f_cabangPusat = () => {
        if(empl_branch != 100){
            return `
            select distinct (personal_subarea), (cabang)  from hr_join_office_v 
            where 
                personal_subarea in ("${personal_subarea}","T001")
                -- and empl_branch in("${empl_branch}", "200")
            `
        }else{
            return `
                select distinct (personal_subarea), cabang from hr_join_office_v 
                where empl_branch = '200'
                UNION all
                select * from (
                    select distinct (personal_subarea), cabang from hr_join_office_v 
                    where empl_branch != '200'
                    order by cabang 
                ) t2
            `
        }
    }
    
    try {
        let q = f_cabangPusat();

        // console.log(q);

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




exports.get_pajak_type = async (req, res) => {


    try {
        // let q = `
        //     select * from tf_eappr.tf_mst_type_request tmtr
        // `
        // let xRes = await simpleExecute(q);

        xRes = [
            {
                PAJAK_CODE: 0,
                PAJAK_NAME: 'PPN'
            },
            {
                PAJAK_CODE: 1,
                PAJAK_NAME: 'PPH'
            },
        ]

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



exports.new_pengajuan = async (req, res) => {
    console.log('\n ===== new_pengajuan ===== \n')
    let arr_pengajuan = req.body.data.pengajuan;
    let arr_komite = req.body.data.komite_approve;
    let user_data = req.body.user_data;
    let selected_file = req.body.file_data;
    let file_name = selected_file['file_name'];
    let base64_sig_data = user_data['base64_sig_data'];

    arr_files = [];

    // console.log(user_data);
    // console.log(arr_pengajuan);
    // console.log(arr_komite);
    // console.log(selected_file);
    // console.log("file_name");
    // console.log(file_name);



    
    try {

        // =======================================================================
        // =========================== DATA CLEANING =============================
        // =======================================================================
        
        let newFileName = '';
        if(file_name.length > 0){
            console.log('there is file')
            newFileName = await change_file_name(selected_file,user_data);
        }

        arr_pengajuan.forEach(el => {
            delete el['FILE_']
            delete el['bind_calc']
            el['FILE_NAME'] = newFileName;
        });


        arr_komite.forEach(el => {
            delete el['empl_name'];
            delete el['function_name'];
            delete el['office_code'];
            delete el['office_name'];
            
        });

        console.log(arr_pengajuan)
        console.log(arr_komite)

        let arr_pengajuan_str = JSON.stringify(arr_pengajuan);
        let arr_komite_str = JSON.stringify(arr_komite);


        console.log('================');
        console.log(arr_pengajuan_str);
        console.log(arr_komite_str);
        console.log('================');
        // console.log(arr_pengajuan_str);


        // =======================================================================
        // ============================= INSERT TO DB ===============================
        // =======================================================================

        let q = `
            SET @result = '';
            CALL P_INSERT_REQUEST(
                '${user_data['office_code']}', 
                '${user_data['empl_code']}', 
                '${user_data['pengajuan_type']}', 
                '${arr_pengajuan_str}',
                '${arr_komite_str}',
                '${get_ttd_filename(base64_sig_data, user_data)}',
                @result
            );
            SELECT @result AS PESAN;
        `

        // console.log(q);

        let xRes = await simpleExecute(q);
        let res_msg = xRes.flat().find(item => item?.PESAN)?.PESAN || "No PESAN found";



        // =======================================================================
        // ===================== HANDLING THE FILE UPLOAD =======================
        // =======================================================================

        if(file_name.length > 0){

            // -----------------------------------------------------------------------
            // ---------------------- GETTING THE FILE EXTENSION ----------------------
            // -----------------------------------------------------------------------

            let file_ext_name = selected_file['file_base64'].split(';')[0].split('/')[1];
            // console.log(file_ext_name);



            // -----------------------------------------------------------------------
            // ------------ CHANGING THE FILE NAME WITH NIK ANDs TIMESTAMP ------------
            // -----------------------------------------------------------------------
            
            const act_date = new Date();
            const dd = String(act_date.getDate()).padStart(2, '0'); 
            const mm = String(act_date.getMonth() + 1).padStart(2, '0'); 
            const yy = String(act_date.getFullYear()).slice(-2); 
            const hh = String(act_date.getHours()).padStart(2, '0'); 
            const minutes = String(act_date.getMinutes()).padStart(2, '0'); 
            const ss = String(act_date.getSeconds()).padStart(2, '0'); 

            const newFileName = `${user_data['empl_code']}_${user_data['office_code']}_${f_helper.get_timestamp_string()}.${file_ext_name}`;
            // console.log(newFileName);


            // -----------------------------------------------------------------------------
            // ------------ PUTTING THE NEW FILE NAME IN THE DATA WE'RE INSERTING ------------
            // -----------------------------------------------------------------------------

            let fileStorage_path = path.join(__dirname, '..', 'file_storage', 'file_pengajuan')        
            await f_helper.file_upload(newFileName, selected_file['file_base64'], fileStorage_path)
        }

        let file_path = path.join(__dirname, '..', 'file_storage', 'ttd_approval');
        await f_helper.file_upload(get_ttd_filename(base64_sig_data, user_data), base64_sig_data, file_path);
        

        // =======================================================================
        // ===================== MAILING THE NEXT COMMITTEE =======================
        // =======================================================================


        var act_request = await get_newest_pengajuan_local(user_data['empl_code']);
        var act_req_data = await search_curr_request_id(act_request);
        
        if(act_req_data[0]['email'] != null){
            let mail_str = `
                <p>
                    Anda memiliki pengajuan untuk di approve dengan detail berikut : 
                    <br>
                    <br>Nomor Pengajuan : ${act_req_data[0]['REQUEST_ID']}
                    <br>Judul Pengajuan : ${act_req_data[0]['KATEGORI_REQUEST']}
                </p>
                <a href="http://192.168.18.4:3026/">Go to E-Approval</a>
            `

            sendMail.sendMail(act_req_data[0]['email'], mail_str);
        }
        

        return res.json({
            isSuccess: true,
            message: res_msg,
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


    return res.json({
        isSuccess: true,
        message: 'success',
        data: 'success'
    })


}



get_ttd_filename = (base64_sig_data,user_data) => {
    file_ext_str = base64_sig_data.split(',')[0].split(';')[0].split('/')[1];

    const act_date = new Date();
    const dd = String(act_date.getDate()).padStart(2, '0'); 
    const mm = String(act_date.getMonth() + 1).padStart(2, '0'); 
    const yy = String(act_date.getFullYear()).slice(-2); 
    const hh = String(act_date.getHours()).padStart(2, '0'); 
    const minutes = String(act_date.getMinutes()).padStart(2, '0'); 
    const ss = String(act_date.getSeconds()).padStart(2, '0');    

    
    file_name_str = `TTD_${user_data['empl_code']}_${dd}${mm}${yy}_${hh}${minutes}${ss}.${file_ext_str}`

    return file_name_str;
}


exports.get_newest_pengajuan = async (req, res) => {
    console.log('\n ========== get_newest_pengajuan ========== \n')
    empl_code = req.query['EMPL_CODE']

    try {
        let q = `
            select * from tf_eappr.tf_trn_fppu_hdrs ttfh 
            where 
                CREATED_BY = '${empl_code}'
            order by ttfh.CREATED_DATE desc , ttfh.REQUEST_ID desc
            limit 0,1
        `
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



get_newest_pengajuan_local = async (empl_code) => {
    console.log('\n ========== get_newest_pengajuan_local ========== \n')

    try {
        let q = `
            select * from tf_eappr.tf_trn_fppu_hdrs ttfh 
            where 
                CREATED_BY = '${empl_code}'
            order by ttfh.CREATED_DATE desc , ttfh.REQUEST_ID desc
            limit 0,1
        `
        let xRes = await simpleExecute(q);
        return xRes[0]['REQUEST_ID'];
    }
    catch (e) {
        return e;
    }
}


 


change_file_name = async(selected_file, user_data) => {

    try {
        // -----------------------------------------------------------------------
        // ---------------------- GETTING THE FILE EXTENSION ----------------------
        // -----------------------------------------------------------------------
    
        file_ext_name = selected_file['file_base64'].split(';')[0].split('/')[1];
        console.log(file_ext_name);
        
    
    
        // -----------------------------------------------------------------------
        // ------------ CHANGING THE FILE NAME WITH NIK ANDs TIMESTAMP ------------
        // -----------------------------------------------------------------------
        
        const act_date = new Date();
        const dd = String(act_date.getDate()).padStart(2, '0'); 
        const mm = String(act_date.getMonth() + 1).padStart(2, '0'); 
        const yy = String(act_date.getFullYear()).slice(-2); 
        const hh = String(act_date.getHours()).padStart(2, '0'); 
        const minutes = String(act_date.getMinutes()).padStart(2, '0'); 
        const ss = String(act_date.getSeconds()).padStart(2, '0'); 
    
        const newFileName = `${user_data['empl_code']}_${user_data['office_code']}_${dd}${mm}${yy}_${hh}${minutes}${ss}.${file_ext_name}`;
    
        return newFileName;
        
    } catch (error) {
        console.log(error);
    }


}



