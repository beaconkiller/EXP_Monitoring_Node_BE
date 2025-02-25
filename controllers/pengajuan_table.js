const path = require("path");
const { simpleExecute } = require("../services/db_e_approve");
const fs = require('fs');
// const path = required('path')

exports.get_table_data = async (req, res) => {
    console.log(req.query);

    let user_dtl = JSON.parse(req.query.user_dtl);
    let empl_code = user_dtl['EMPL_CODE'];
    let q_page = parseInt(req.query.q_page);
    let q_search = req.query.q_search;
    let q_filter = req.query.q_filter;

    
    f_paging = () => {
        let limit = 8
        let offset = (q_page-1) * limit
        return [limit, offset]
    }

    f_search = () => {
        if(q_search.trim().length == 0){
            return ``;
        }else{
            return `
            -- Con Search // BISA ADA BISA GAADA
            and (
                KATEGORI_REQUEST like '%${q_search}%'
                OR
                REQUEST_ID like '%${q_search}%'                
            )
            -- Con Search
            `
        }
    }

    f_filter = () => {
        if(q_filter == 'All'){
            return ``;
        }else{
            return `AND tbl_fin.STATUS = '${q_filter}'`
        }
    }

    try {
        var q = `
            select * from (
                select ttfh.*, ta.LVL, ta.EMPL_CODE as EMPL_CODE_ON_HAND, ta.EMPL_NAME as EMPL_NAME_ON_HAND  from tf_trn_fppu_hdrs ttfh 
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
                                -- and
                                -- STATUS is null
                        ) 
                ) ta on ta.REQUEST_ID = ttfh.REQUEST_ID
            ) tbl_fin
            where 
                CREATED_BY = '${empl_code}'
                ${f_filter()}
                ${f_search()}

            ORDER BY ttfh.CREATED_DATE desc, ttfh.REQUEST_ID desc
            LIMIT ${f_paging()[0]}
            OFFSET ${f_paging()[1]}
        `

        // console.log(q);

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




