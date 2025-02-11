const { set_response } = require('../../../config/set_response');
const database_absensi = require('../../../services/db_e_approve');

exports.getUser = async function (req, res) {
    try {
        var user_nik = req.data.user_nik;
        var device_id = req.data.device_id;

        var result = await database_absensi.simpleExecute(
            `
                select o.EMPL_CODE,
                    o.EMPL_BRANCH,
                    c.name_short as EMPL_BRANCH_NAME,
                    o.EMPL_NAME,
                    o.EMPL_JOB,
                    e.JOB_DESCRIPTION,
                    o.EMPL_STATUS,
                    null as EMPL_EFF_DATE,
                    o.empl_coy as COY_ID,
                    o.EMPL_START_EFF_DATE,
                    o.EMPL_START_END_DATE,
                    o.identity_no as EMPL_NIK_KTP,
                    o.REFF_EMPL_CODE,
                    b.user_pwd as EMPL_PWD,
                    a.FUNC_ID,
                    d.FUNC_NAME,
                    o.DEVICE_ID,
                    d.SWITCH_OFFICE,
                    o.IS_MOBILE_ATTD,
                    o.SUPERVISOR_ID,
                    o.IMAGE
                from tf_absensi.hr_mst_employees o
                left join tf_absensi.hr_sec_office_users a on a.user_id = o.empl_Code 
                left join tf_absensi.hr_sec_users b on b.user_id = o.empl_Code
                left join tf_absensi.hr_mst_offices c on c.office_code = o.empl_branch
                left join tf_absensi.hr_sec_functional d on d.func_id = a.func_id
                left join tf_absensi.hr_mst_job_codes e on e.job_code = o.empl_job
                where empl_Code = :user_nik
                and empl_status = 'PM'
            `    , { user_nik }
        )

        if (result.length > 0) {
            //#region bypass device id untuk rabil
            if (!['71004426', '71004433', '71001114', '23040322', '21030501', '23040353']) {
                if (!result[0].DEVICE_ID) {
                    res.status(401).send("Device Tidak Terdaftar");
                    return;
                } else if (result[0].DEVICE_ID != device_id) {
                    res.status(401).send("Device Tidak Terdaftar");
                    return;
                }
            }

            var nameParts = result[0].EMPL_NAME.split(' ');
            var emplName = nameParts.slice(0, 2).join(' ');
            if (nameParts.length > 2) {
                emplName += ' ' + nameParts[2][0];
            }

            var data = {
                "userName": emplName,
                "userNik": result[0].EMPL_CODE,
                "emplBranch": result[0].EMPL_BRANCH,
                "userJob": result[0].FUNC_NAME,
                "emplBranchName": result[0].EMPL_BRANCH_NAME,
                "switchOffice": result[0].SWITCH_OFFICE,
                "imagesProfil": result[0].IMAGE,
            };

            res.json(set_response(true, "Success", data));
        } else {
            res.status(401).json("NIK tidak terdaftar.");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send("Something wrong!");
    }
};
