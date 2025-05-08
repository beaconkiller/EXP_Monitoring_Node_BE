var db_e_approve = require('./services/db_e_approve');
const conf_e_approve = require('./config/database')
const webServer = require('./services/web-server');
const { send_whatsapp } = require('./controllers/f_whatsapp');



async function startup() {

    // ----------------------------------------
    // ------------- DB_E_APPROVE -------------
    // ----------------------------------------
    console.log(process.env.E_APPROVE_HOST);

    try {
        console.log('\n Initializing db_e_approve \n');
        await db_e_approve.initialize();
        console.log('db_e_approve done');
    } catch (err) {
        console.error(err);
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
    global.base_url = 'http://localhost:4000/'
    // global.base_url = 'http://192.168.1.20:5000/administrator/'
    // global.base_url = 'http://103.154.81.163:3000/administrator/'
    global.app_name = 'test admin'
}





startup();