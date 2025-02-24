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
                sec_usr.USER_PWD,
                (select PERSONAL_SUBAREA from tf_mst_division  where personal_number = fme.empl_code) as personal_subarea
            from tf_absensi.fs_mst_employees fme 
            join tf_absensi.fs_mst_offices fmo on fmo.OFFICE_CODE = fme.EMPL_BRANCH 
            join tf_absensi.hr_mst_job_codes hmjc on fme.EMPL_JOB = hmjc.JOB_CODE
            join tf_absensi.hr_mst_employees mst_e on mst_e.EMPL_CODE = fme.EMPL_CODE 
            join tf_absensi.fs_sec_users sec_usr on fme.EMPL_CODE = sec_usr.USER_ID
            where 
                fme.EMPL_CODE = '${usn}'
                and 
                sec_usr.USER_PWD = sha2('${pwd}',256)
        `

        var xRes = await simpleExecute(q)
        console.log(xRes);
    

        // ------------------------------------------------------------------
        // ------------- IF DATA IS LESS THAN 1 OR 0 OR NOT EXIST -------------
        // ------------------------------------------------------------------

        if(xRes.length == 0 ){
            return res.json({
                isSuccess: false,
                message: 'Username atau password salah',
                data: null
            })
        }


        // ------------------------------------------------------------------
        // ------------------------ SEARCH THE PASSWORD ------------------------
        // ------------------------------------------------------------------

        // tmp_pwd = `Uat${xRes[0]['EMPL_CODE']}`
        // if(pwd != tmp_pwd){
        //     return res.json({
        //         isSuccess: false,
        //         message: 'Username atau password salah',
        //         data: null
        //     })
        // }
    
    
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




exports.tests = async (req, res) => {

    return res.status(200).json({
        isSuccess: true,
        data: 'ok'
    })
}