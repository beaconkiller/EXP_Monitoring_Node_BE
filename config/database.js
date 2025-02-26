module.exports = {
    e_approve: {
        // host: '192.168.18.4',
        host: process.env.E_APPROVE_HOST,
        user: process.env.E_APPROVE_USER,
        password: process.env.E_APPROVE_PWD,
        database: 'tf_eappr',
        multipleStatements: true,
        dateStrings: true,
        connectionLimit: 10,
        // timezone: '+07:00',
        // poolAlias: 'database_absensi'
    },
}