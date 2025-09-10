const path = require("path");
const fs = require('fs');
const db_sitemap = require('../../services/db_sitemap');
const repoDb = require("../../repository/repo.db");

exports.get_project_all = (req, res) => {
    console.log('\n =========== get_project(req, res) ========= \n')

    const arr_data = [
        {
            'project_id': 'PR0001',
            'project_name': 'Tangerang Estate',
        },
        {
            'project_id': 'PR0002',
            'project_name': 'Cinere Resort',
        },
        {
            'project_id': 'PR0003',
            'project_name': 'Gandul Land',
        },
        {
            'project_id': 'PR0004',
            'project_name': 'Jaktim Pride',
        },
    ];

    try {

        res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            data: arr_data,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return error
    }
}



exports.get_project_hdrs = (req, res) => {
    console.log('\n =========== get_project_hdrs ========= \n')
    let data = req.query;
    console.log(data);
    let project_id = data['project_id'];

    const arr_data = [
        {
            'project_id': 'PR0001',
            'project_name': 'Tangerang Estate',
        },
        {
            'project_id': 'PR0002',
            'project_name': 'Cinere Resort',
        },
        {
            'project_id': 'PR0003',
            'project_name': 'Gandul Land',
        },
        {
            'project_id': 'PR0004',
            'project_name': 'Jaktim Pride',
        },
    ];


    try {
        for (var el of arr_data) {
            if (el['project_id'] == project_id) {
                return res.json({
                    status: 200,
                    isSuccess: true,
                    message: 'nih',
                    data: el,
                })
            }
        }

        res.json({
            status: 400,
            isSuccess: true,
            message: 'Tidak ada data',
            data: null,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return error
    }
}



exports.get_project_pin = (req, res) => {
    console.log('\n =========== get_project_pin ========= \n')

    let data = req['query'];
    let project_id = data['project_id'];
    console.log(project_id);

    // 40.32257960055393
    // 19.03209810888726

    const arr_data_2 = [
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A1',
            'blok_id': 'A',
            'x': '1902.401603374355',
            'y': '1973.44399079453',
            'img_name': null,
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A2',
            'blok_id': 'A',
            'x': '492.6181176346023',
            'y': '321',
            'img_name': null,
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B1',
            'blok_id': 'B',
            'x': '120',
            'y': '325',
            'img_name': null,
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B2',
            'blok_id': 'B',
            'x': '142',
            'y': '132',
            'img_name': null,
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B3',
            'blok_id': 'B',
            'x': '482',
            'y': '152',
            'img_name': null,
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'C1',
            'blok_id': 'C',
            'x': '482',
            'y': '152',
            'img_name': null,
        },
    ];

    const arr_data = [
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A1',
            'blok_id': 'A',
            'x': '405.17840175446037',
            'y': '216.52341539237315',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A2',
            'blok_id': 'A',
            'x': '492.6181176346023',
            'y': '321',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B1',
            'blok_id': 'B',
            'x': '120',
            'y': '325',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B2',
            'blok_id': 'B',
            'x': '142',
            'y': '132',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B3',
            'blok_id': 'B',
            'x': '482',
            'y': '152',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'C1',
            'blok_id': 'C',
            'x': '482',
            'y': '152',
            'img_name': 'Tangerang_Estate.jpg',
        },
    ];



    try {
        res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            // data: arr_data_2,
            data: arr_data,
        })
    } catch (error) {
        console.log('\n ============= ERR ============= \n');
        console.log(error);
        console.log('\n ============= ERR ============= \n');
        return error;
    }
}



exports.get_project_pin_from_db = async (req, res) => {
    console.log('\n =========== get_project_pin_from_db ========= \n')

    let data = req['query'];
    let project_id = data['project_id'];
    console.log(project_id);

    const arr_data = [
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A1',
            'blok_id': 'A',
            'x': '405.17840175446037',
            'y': '216.52341539237315',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'A2',
            'blok_id': 'A',
            'x': '492.6181176346023',
            'y': '321',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B1',
            'blok_id': 'B',
            'x': '120',
            'y': '325',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B2',
            'blok_id': 'B',
            'x': '142',
            'y': '132',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'B3',
            'blok_id': 'B',
            'x': '482',
            'y': '152',
            'img_name': 'Tangerang_Estate.jpg',
        },
        {
            'project_id': 'Tangerang Estate',
            'pin_id': 'C1',
            'blok_id': 'C',
            'x': '482',
            'y': '152',
            'img_name': 'Tangerang_Estate.jpg',
        },
    ];



    try {


        let q = `
            select smpm.*, smp.sitemap_img from sm_mst_pin_mapping smpm 
            join sm_mst_project smp on smp.project_id = smpm.project_id 
            where 
                smpm.project_id = '${project_id}'
        `

        let xRes = await db_sitemap.simpleExecute(q);

        console.log(xRes);

        res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            // data: arr_data_2,
            data: xRes,
        })
    } catch (error) {
        console.log('\n ============= ERR ============= \n');
        console.log(error);
        console.log('\n ============= ERR ============= \n');
        return error;
    }
}



exports.get_sitemap_image = (req, res) => {
    console.log('\n =========== get_sitemap_image(req, res) ========= \n');

    let data = req['query'];
    let imgPath = data['imgPath'];




    try {

        let arr_files = fs.readdirSync(path.join(global.dir_sitemap))

        if (!arr_files.includes(imgPath)) {
            return res.json({
                status: 500,
                isSuccess: false,
                message: 'File not found',
                data: null,
            })
        }

        let ext_map = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }

        let file_path = path.join(global.dir_sitemap, imgPath);
        let file_read = fs.readFileSync(path.join(global.dir_sitemap, imgPath));
        let file_ext = path.extname(file_path).toLowerCase();

        let img_base64 = fs.readFileSync(path.join(global.dir_sitemap, imgPath)).toString('base64');

        let img_uri = `data:${ext_map[file_ext]};base64,${img_base64}`;

        // console.log(img_uri);

        return res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            data: img_uri,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')

        return res.json({
            status: 500,
            isSuccess: false,
            message: error.toString(),
            data: error,
        })

    }
}



exports.export_save_unit_mapping = async (req, res) => {
    console.log('\n =========== export_save_unit_mapping ========= \n')
    let data = req['body'];
    let arr_units = data['arr_unit_data'];


    // console.log(arr_units);

    let client;
    try {
        let pool = repoDb.getter_pool();
        client = await pool.connect();
        await client.query('BEGIN');

        for (const el of arr_units) {

            // UPDATE public.sm_mst_pin_mapping
            // 	SET y_pixel='123',x_pixel='231'
            // 	WHERE unit_id='B2' AND blok_id='B' AND x_pixel='142' AND y_pixel='132' AND project_id='PR0001'            

            console.log(el);

            // {
            // unit_id: 'B2',
            // blok_id: 'B',
            // x_pixel: '142',
            // y_pixel: '132',
            // project_id: 'PR0001',
            // sitemap_img: 'Tangerang_Estate.jpg',
            // xV: 14.185814185814186,
            // yV: 11.956521739130434
            // }            

            let q = `
                UPDATE public.sm_mst_pin_mapping
                    SET y_pixel='${el['y_pixel']}', x_pixel='${el['x_pixel']}'
                    WHERE unit_id='${el['unit_id']}' AND project_id='${el['project_id']}'                        
            `

            let xRes = await client.query(q);
        }

        await client.query('COMMIT');

        return res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            data: null,
        })
    } catch (error) {
        console.log('\n ============= ERR ============= \n');
        console.log(error);
        console.log('\n ============= ERR ============= \n');

        console.error(err);

        await client.query('ROLLBACK');

        return res.json({
            status: 500,
            isSuccess: false,
            message: 'Proses menyimpan data gagal',
            data: null,
        });
    } finally {
        client.release()
    }
}



exports.test = (req, res) => {
    console.log('\n =========== test(req, res) ========= \n');


    try {

        let arr_files = fs.readdirSync(path.join(global.dir_sitemap))

        if (!arr_files.includes(imgPath)) {
            return res.json({
                status: 500,
                isSuccess: false,
                message: 'File not found',
                data: null,
            })
        }

        let ext_map = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp'
        }

        let file_path = path.join(global.dir_sitemap, imgPath);
        let file_read = fs.readFileSync(path.join(global.dir_sitemap, imgPath));
        let file_ext = path.extname(file_path).toLowerCase();

        let img_base64 = fs.readFileSync(path.join(global.dir_sitemap, imgPath)).toString('base64');

        let img_uri = `data:${ext_map[file_ext]};base64,${img_base64}`;


        return res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            data: img_uri,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')

        return res.json({
            status: 500,
            isSuccess: false,
            message: error.toString(),
            data: error,
        })

    }

}
