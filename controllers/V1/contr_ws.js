const path = require("path");
const fs = require('fs');
const db_sitemap = require('../../services/db_sitemap');
const repoDb = require("../../repository/repo.db");
const HelperV2 = require("../../repository/repo.helperV2");
const Repo_WS = require('../../repository/repo.ws');

exports.get_ws_clients = (req, res) => {
    console.log('\n =========== get_ws_clients ========= \n')

    arr_data = [];


    let x = Repo_WS.getter_clients();

    let arr_tmp = [];
    x.forEach((el) => {
        arr_tmp.push(el.deviceId);
    })


    try {

        res.json({
            status: 200,
            isSuccess: true,
            message: 'nih',
            data: arr_tmp,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return error
    }
}

exports.test_cmd = (req, res) => {
    console.log('\n =========== test_cmd ========= \n')


    Repo_WS.send_message('get_storage', '102.321.323.12');


    try {

        res.json({
            status: 200,
            isSuccess: true,
            message: 'test',
            data: null,
        })

    } catch (error) {
        console.log('\n ============= ERR ============= \n')
        console.log(error)
        console.log('\n ============= ERR ============= \n')
        return error
    }
}



