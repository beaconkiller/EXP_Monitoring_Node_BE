const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
// const path = required('path')

exports.login_main = async (req, res) => {

    console.log(req);

    try {
        return res.json({
            message: 'test'
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
    arr_pengajuan = req.body.data.pengajuan;
    arr_komite = req.body.data.komite_approve;
    user_data = req.body.user_data;

    arr_files = [];


    // console.log(arr_pengajuan);
    // console.log(arr_komite);
    console.log(user_data);





    // =======================================================================
    // ============================= DATA CLEANING ===============================
    // =======================================================================

    arr_pengajuan.forEach(el => {
        // console.log(el['FILE_NAME']);
        if (el['FILE_NAME'] != null) {
            obj = {
                FILE_NAME: el['FILE_NAME'],
                FILE_: el['FILE_'],
            }
            arr_files.push(obj);
        }
        delete el['FILE_']
    });

    arr_komite.forEach(el => {
        delete el['empl_name'];
        delete el['function_name'];
        delete el['office_code'];
        delete el['office_name'];
    });

    let arr_pengajuan_str = JSON.stringify(arr_pengajuan);
    let arr_komite_str = JSON.stringify(arr_komite);



    // =======================================================================
    // ============================= INSERT TO DB ===============================
    // =======================================================================

    let q = `
        SET @result = '';
        CALL P_INSERT_REQUEST('${user_data['office_code']}', '${user_data['empl_code']}', '${user_data['pengajuan_type']}', 
                                                    '${arr_pengajuan_str}',
                                                    '${arr_komite_str}',
                                                    @result
                                                    );
        SELECT @result AS PESAN;
    `

    let xRes = await simpleExecute(q);
    let res_msg = xRes.flat().find(item => item?.PESAN)?.PESAN || "No PESAN found";









    // =======================================================================
    // ===================== HANDLING THE FILE UPLOADING =======================
    // =======================================================================

    // arr_pengajuan.forEach(el => {
    //     // console.log(el.FILE_NAME)
    // });

    // let fileStorage_path = path.join(__dirname, '..', 'file_storage', 'file_pengajuan')
    // let fileData = arr_pengajuan[0]['FILE_'].split(',')[1]
    // const binary_data = Buffer.from(fileData, 'base64')

    // console.log(fileData);

    // fs.writeFile(fileStorage_path + '/asd.jpg', binary_data, function (err) {
    //     if (err) {
    //         console.log(err)
    //     }
    //     console.log('file saved')
    // })



    try {
        return res.json({
            message: 'test'
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


exports.test = async (req, res) => {

    console.log(req);

    try {

        let xRes = await simpleExecute('SELECT * FROM CITY');
        console.log(xRes);

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