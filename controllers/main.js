const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
// const path = required('path')

exports.login_main = async (req, res) => {
    console.log(req.query)
    usn = req.query.usn;
    pwd = req.query.pwd;
    
    try {
        var q = `
            select 
                fme.*, 
                fmo.NAME_SHORT, 
                fmo.NAME_FULL, 
                hmjc.JOB_DESCRIPTION,
                mst_e.email,
                mst_e.supervisor_id,
                (select PERSONAL_SUBAREA from tf_mst_division  where personal_number = fme.empl_code) as personal_subarea
            from tf_absensi.fs_mst_employees fme 
            join tf_absensi.fs_mst_offices fmo on fmo.OFFICE_CODE = fme.EMPL_BRANCH 
            join tf_absensi.hr_mst_job_codes hmjc on fme.EMPL_JOB = hmjc.JOB_CODE
            join tf_absensi.hr_mst_employees mst_e on mst_e.EMPL_CODE = fme.EMPL_CODE 
            WHERE fme.EMPL_CODE = '${usn}'
        `

        var xRes = await simpleExecute(q)
    

        // ------------------------------------------------------------------
        // ------------- IF DATA IS LESS THAN 1 OR 0 OR NOT EXIST -------------
        // ------------------------------------------------------------------

        if(xRes.length == 0 ){
            return res.json({
                isSuccess: false,
                message: 'Username tidak terdaftar',
                data: null
            })
        }


        // ------------------------------------------------------------------
        // ------------------------ SEARCH THE PASSWORD ------------------------
        // ------------------------------------------------------------------

        tmp_pwd = `Uat${xRes[0]['EMPL_CODE']}`
        if(pwd != tmp_pwd){
            return res.json({
                isSuccess: false,
                message: 'Username atau password salah',
                data: null
            })
        }
    
    
        // xRes = {
        //     empl_name: 'Muhammad Ramzy',
        //     empl_code: '71005122',
        //     empl_jobcode: 'IT',
        //     office_name: 'Depok',
        // }

        return res.json({
            isSuccess: true,
            message: 'success',
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