const mysql = require('mysql');
const dbConfig = require('../config/database.js');

var pool;


async function initialize() {
    try {
        pool = mysql.createPool(dbConfig.e_approve);

        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error connecting to the db_e_approve', err.message);
                    // process.exit(1); // Exit the process if connection fails
                }

                try {
                    connection.release(); // Release the connection back to the pool
                } catch (error) {
                    console.error(error)
                }
            });
        } catch (error) {
            console.error(error);
        }


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
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection(function (err, connection) {
                connection.config.queryFormat = function (query, values) {
                    if (!values) return query;
                    return query.replace(/\:(\w+)/g, function (txt, key) {
                        if (values.hasOwnProperty(key)) {
                            return connection.escape(values[key]);
                        }
                        return txt;
                    }.bind(this));
                };

                if (err) {
                    console.error(err)
                }

                connection.query(statement, binds, (error, results, fields) => {
                    connection.release();

                    if (error) throw error;

                    // console.log(results);
                    resolve(results);
                })
            })
        } catch (err) {
            console.error(err);
            reject(err);
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





    // return new Promise(async (resolve, reject) => {
    //     try {
    //         pool.getConnection(function (err, connection) {
    //             connection.config.queryFormat = function (query, values) {
    //                 if (!values) return query;
    //                 return query.replace(/\:(\w+)/g, function (txt, key) {
    //                     if (values.hasOwnProperty(key)) {
    //                         return connection.escape(values[key]);
    //                     }
    //                     return txt;
    //                 }.bind(this));
    //             };

    //             connection.query(statement, binds, (error, results, fields) => {
    //                 connection.release();

    //                 if (error) throw error;

    //                 resolve(results);
    //             })
    //         })
    //     } catch (err) {
    //         reject(err);
    //     } finally {
    //         // if (conn) { // conn assignment worked, need to close
    //         //     try {
    //         //         await conn.close();
    //         //     } catch (err) {
    //         //         console.log(err);
    //         //     }
    //         // }
    //     }
    // });
}

module.exports.simpleExecute = simpleExecute;