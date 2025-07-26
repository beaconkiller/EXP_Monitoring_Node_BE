var db_e_approve = require('./services/db_e_approve');
const conf_e_approve = require('./config/database')
const webServer = require('./services/web-server');
const moment = require('moment');
const path = require('path');
const os = require('os');



async function startup() {

    // ----------------------------------------
    // ------------ SET GLOBAL VAR ------------
    // ----------------------------------------

    setGlobalVariable();



    // ----------------------------------------
    // ------------- DB_E_APPROVE -------------
    // ----------------------------------------

    // try {
    //     console.log('\n Initializing db_e_approve \n');
    //     await db_e_approve.initialize();
    //     console.log('db_e_approve done');
    // } catch (err) {
    //     console.error(err);
    //     process.exit(1);
    // }



    // ----------------------------------------
    // -------------- WEB-SERVER --------------
    // ----------------------------------------

    try {
        console.log('Initializing web server module');

        await webServer.initialize();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1); // Non-zero failure code
    }



    // ===========================================
    // ================= DEBUG ===================
    // ===========================================

    // excel_inp.excel_read();

}

async function shutdown(e) {
    try {
        console.log('Closing db_e_approve');
        await db_e_approve.close()
        console.log('db_e_approve closed');
    } catch (error) {
        console.error(error);
    }
}



async function setGlobalVariable() {
    global.base_url = 'http://localhost:4000/';
    // global.base_url = 'http://192.168.1.20:5000/administrator/'
    // global.base_url = 'http://103.154.81.163:3000/administrator/'
    global.app_name = 'test admin';
    global.base_dir = __dirname;
    global.dir_sitemap = path.join(__dirname,'file_storage','file_sitemap');
}




startup();