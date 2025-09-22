var db_sitemap = require('./services/db_sitemap');
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
    // ------------- DB_SITEMAP -------------
    // ----------------------------------------

    try {
        db_sitemap.initialize();
        console.log('Initializing web DB_SITEMAP');
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }


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
    global.dir_controllers = path.join(__dirname,'controllers');
}




startup();