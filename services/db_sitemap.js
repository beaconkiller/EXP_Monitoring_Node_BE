const dbConfig = require('../config/database.js');
const repoDb = require('../repository/repo.db.js');
const { Pool } = require('pg');

var pool;


async function initialize() {
    try {
        pool = new Pool(dbConfig.db_sitemap);
        repoDb.setter_pool(pool);

        // try {
        //     pool.getConnection((err, connection) => {
        //         if (err) {
        //             console.error('Error connecting to the db_e_approve', err.message);
        //             // process.exit(1); // Exit the process if connection fails
        //         }

        //         try {
        //             connection.release(); // Release the connection back to the pool
        //         } catch (error) {
        //             console.error(error)
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        // }


    } catch (error) {
        console.error(error);
    }
}

module.exports.initialize = initialize;

async function close() {
    pool.end()
}


module.exports.close = close;

async function simpleExecute(statement, binds = [], opts = {}) {
    return new Promise(async (resolve, reject) => {
        try {

            let xRes = await pool.query(statement);
            // console.log(xRes)
            resolve(xRes.rows);


        } catch (err) {
            console.error(err);
            reject(err);
            throw err;
        } finally {
            // if (conn) { // conn assignment worked, need to close
            //     try {
            //         conn.close();
            //     } catch (err) {
            //         console.log(err);
            //     }
            // }
        }
    })
}


module.exports.simpleExecute = simpleExecute;


async function simpleExecute_many(statements, binds = [], opts = {}) {
    let client;

    try {
        client = await pool.connect();
    } catch (error) {
        initialize();
    }


    try {
        let arr_res = [];

        await client.query('BEGIN');


        for (const sql of statements) {

            let xRes = await client.query(sql);
            arr_res.push(xRes.rows);
        }

        await client.query('COMMIT');

        return arr_res;
    } catch (err) {
        console.error(err);

        await client.query('ROLLBACK');

        throw err;
    } finally {
        await client.release();
    }
}

module.exports.simpleExecute_many = simpleExecute_many;