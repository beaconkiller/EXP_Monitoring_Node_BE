const { Pool } = require('pg');
const dbConfig = require('../config/database.js');

let pool;

async function initialize() {
    try {
        pool = new Pool(dbConfig.db_sitemap);

        const client = await pool.connect();
        console.log('Connected to PostgreSQL');
        client.release();
    } catch (e) {
        console.error('Failed to connect PostgreSQL:', e.message);

        try {
            pool = new Pool(dbConfig.db_sitemap);
            const client = await pool.connect();
            console.log('Connected to PostgreSQL (retry)');
            client.release();
        } catch (err) {
            throw new Error(err);
        }
    }
}

module.exports.initialize = initialize;


async function close() {
    if (pool) {
        try {
            await pool.end();
            console.log('PostgreSQL pool closed');
        } catch (err) {
            console.error('Error closing pool:', err.message);
        }
    }
}

module.exports.close = close;

async function simpleExecute(statement, binds = []) {
    const client = await pool.connect(); // Dapatkan koneksi dari pool
    try {
        const result = await client.query(statement, binds);
        return result.rows;
    } catch (err) {
        throw err; // Lemparkan error
    } finally {
        client.release(); // Pastikan koneksi dikembalikan ke pool
    }
}


module.exports.simpleExecute = simpleExecute;


async function simpleExecute_many(statements, bindsArr = []) {
    const client = await pool.connect();

    try {
        let arr_res = [];
        await client.query('BEGIN');

        for (let i = 0; i < statements.length; i++) {
            const sql = statements[i];
            const binds = bindsArr[i] || [];
            const result = await client.query(sql, binds);
            arr_res.push(result.rows);
        }

        await client.query('COMMIT');
        return arr_res;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports.simpleExecute_many = simpleExecute_many;
