const reader = require('xlsx');
const { simpleExecute } = require('../services/db_e_approve');



exports.excel_read = async () => {
    console.log('=============== excel_read ==============')
    try {
        const file = reader.readFile('C:\\Users\\Msi Gaming\\Downloads\\Coa.xlsx');

        const sheet = file.Sheets['Sheet1'];


        const data = reader.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 means it returns an array of arrays


        const dateNow = new Date();
        const dateStr = dateNow.toISOString().split('T')[0];

        console.log(dateStr);

        let idCount = 56;
        for (var el of data) {
            idCount += 1;

            let q = `
                INSERT INTO tf_eappr.tf_mst_type_request (
                    id_type,
                    NAME_TYPE,
                    group_type,
                    is_active,
                    created_by,
                    created_date,
                    COA_NUMBER
                )
                VALUES (
                    :id_type,
                    :NAME_TYPE,
                    :group_type,
                    :is_active,
                    :created_by,
                    :created_date,
                    :COA_NUMBER
                )
            `

            let binds = {
                id_type: `REQ${idCount.toString().padStart(4, '0')}`,
                NAME_TYPE: el[1],
                group_type: 'P_PUSAT',
                is_active: 'AC',
                created_by: 'SYSTEM',
                created_date: dateStr,
                COA_NUMBER: el[0]
            };

            console.log(binds);

            await simpleExecute(q, binds);
        }

    } catch (error) {
        console.error(error);
    }
}