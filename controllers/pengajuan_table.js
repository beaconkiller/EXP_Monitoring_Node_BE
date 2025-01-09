const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
// const path = required('path')

exports.get_table_data = async (req, res) => {
    user_dtl = JSON.parse(req.query.user_dtl)
    empl_code = user_dtl['EMPL_CODE'];
    q_page = parseInt(req.query.q_page)

    // console.log(empl_code);

    f_paging = () => {
        let limit = 8
        let offset = (q_page-1) * limit
        return [limit, offset]
    }

    try {
        var q = `
            SELECT ttfh.*, hjov.cabang
            FROM tf_eappr.tf_trn_fppu_hdrs ttfh
            JOIN (
                select distinct empl_branch, cabang, personal_subarea 
                from hr_join_office_v hjov 
            ) hjov ON ttfh.BRANCH_CODE = hjov.empl_branch
            where 
                CREATED_BY = '${empl_code}'

            ORDER BY ttfh.CREATED_DATE desc, ttfh.REQUEST_ID desc
            LIMIT ${f_paging()[0]}
            OFFSET ${f_paging()[1]}
        `

        xRes = await simpleExecute(q);
        // console.log(xRes);


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



exports.get_table_data_approval = async (req, res) => {
    user_dtl = JSON.parse(req.query.user_dtl)
    empl_code = user_dtl['EMPL_CODE'];
    q_page = parseInt(req.query.q_page)

    // console.log(empl_code);

    f_paging = () => {
        let limit = 8
        let offset = (q_page-1) * limit
        return [limit, offset]
    }

    try {
        var q = `
            select ttfh.*, ta.LVL, ta.EMPL_CODE, ta.STATUS, ta.EMPL_NAME  from tf_trn_fppu_hdrs ttfh 
            join (
                select 
                    ttaf.REQUEST_ID, 
                    ttaf.EMPL_CODE, 
                    ttaf.LVL, 
                    ttaf.STATUS, 
                    tlav.empl_name  
                from tf_eappr.tf_trn_approve_fppu ttaf 
                join tf_list_approve_v tlav on tlav.empl_code = ttaf.EMPL_CODE 
                where 
                    ttaf.LVL = (
                        select MIN(LVL) from tf_eappr.tf_trn_approve_fppu ttaf2 
                        where 
                            ttaf2.REQUEST_ID = ttaf.REQUEST_ID 
                            and
                            STATUS is null
                    ) 
            ) ta on ta.REQUEST_ID = ttfh.REQUEST_ID 
            where ta.EMPL_CODE = '${empl_code}'
            ORDER BY ttfh.CREATED_DATE desc
            
            LIMIT ${f_paging()[0]}
            OFFSET ${f_paging()[1]}
        `

        // var q = `
        //     SELECT ttfh.*, hjov.cabang, appr.*
        //     FROM tf_eappr.tf_trn_fppu_hdrs ttfh
        //     JOIN (
        //         select distinct empl_branch, cabang, personal_subarea 
        //         from hr_join_office_v hjov 
        //     ) hjov ON ttfh.BRANCH_CODE = hjov.empl_branch
        //     left join (
        //         select REQUEST_ID, STATUS, EMPL_CODE from tf_eappr.tf_trn_approve_fppu ttaf 
        //         where 
        //             EMPL_CODE = '${empl_code}'
        //     ) appr on appr.REQUEST_ID = ttfh.REQUEST_ID 
        //     where 
        //         appr.EMPL_CODE = '${empl_code}'
        //     ORDER BY ttfh.CREATED_DATE desc
            
        //     LIMIT ${f_paging()[0]}
        //     OFFSET ${f_paging()[1]}
        // `

        console.log(q);

        xRes = await simpleExecute(q);
        // console.log(xRes);


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