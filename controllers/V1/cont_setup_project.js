const path = require("path");
const fs = require('fs');
const db_sitemap = require('../../services/db_sitemap');
const repoDb = require("../../repository/repo.db");
const HelperV2 = require("../../repository/repo.helperV2");

exports.get_project_all = async (req, res) => {
    console.log('\n =========== get_project(req, res) ========= \n')
    let data = req.query;
    console.log(data);


    try {
        let q = `
            select * from MS_PROYEK mp;
        `

        let xRes = await db_sitemap.simpleExecute(q);
        console.log(xRes);

        res.json({
            status: 200,
            isSuccess: true,
            message: 'success',
            data: xRes,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return res.json({
            status: 500,
            isSuccess: false,
            message: error,
            data: null,
        })
    }
}



exports.inp_new_project = async (req, res) => {
    console.log('\n =========== inp_new_project(req, res) ========= \n')
    let data = req.body;
    console.log(data);

    try {

        // p_input_mst_proyek(
        //     IN p_proyek_name text, 
        //     IN p_kategori text, 
        //     IN p_alamat text, 
        //     IN p_rt_rw text, 
        //     IN p_kelurahan text, 
        //     IN p_kecamatan text, 
        //     IN p_kota text, 
        //     IN p_provinsi text, 
        //     IN p_user_id text
        // )

        let q = `
            CALL P_INPUT_MST_PROYEK(
                '${data['str_proyek_name']}', 
                '${data['str_kategori']}', 
                '${data['str_alamat']}', 
                '${data['str_rt_rw']}', 
                '${data['str_kelurahan']}', 
                '${data['str_kecamatan']}', 
                '${data['str_kota']}', 
                '${data['str_provinsi']}', 
                '${data['str_user_id']}'
            );
        `

        await HelperV2.set_delay(2000);

        let xRes = await db_sitemap.simpleExecute(q);
        console.log(xRes);

        res.json({
            status: 200,
            isSuccess: true,
            message: 'success',
            data: null,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return res.json({
            status: 500,
            isSuccess: false,
            message: error,
            data: null,
        })
    }
}



exports.inp_new_blok = async (req, res) => {
    console.log('\n =========== inp_new_blok(req, res) ========= \n')
    let data = req.body;
    console.log(data);

    try {

        // p_input_mst_blok(
        //     IN p_blok_name text, 
        //     IN p_type_blok text, 
        //     IN p_proyek_id text, 
        //     IN p_jumlah integer, 
        //     IN p_user_id text, 
        //     OUT p_msg text
        // ) 
        
        let q = `
            CALL p_input_mst_blok(
                '${data['str_blok_name']}', 
                '${data['str_type_blok']}', 
                '${data['str_proyek_id']}', 
                '${data['int_jumlah']}',
                '${data['str_empl_code']}',
                p_msg
            );
        `

        // let xRes = await db_sitemap.simpleExecute(q);
        // console.log(xRes);

        res.json({
            status: 200,
            isSuccess: true,
            message: 'success',
            data: null,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return res.json({
            status: 500,
            isSuccess: false,
            message: error,
            data: null,
        })
    }
}






