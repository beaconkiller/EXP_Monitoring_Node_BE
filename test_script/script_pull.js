const { exec } = require('child_process');
const fs = require('fs');



let config = {
    "data": [
        {
            "gh": "https://github.com/beaconkiller/EXP_Monitoring_Node_BE",
            "branch": "master"
        },
        {
            "gh": "https://github.com/beaconkiller/EXP_Monitoring_NG_FE",
            "branch": "master"
        }
    ],
    "key": ""
}



async function main() {
    for (var el of config['data']) {
        let cmd = `git clone -b ${el['branch']} ${el['gh']}`
        let _res = await new Promise((resolve, reject) => {
            exec(cmd, (err, stdout) => {
                if (err) reject(err);
                resolve(stdout);
            });
        });
        console.log(_res);
    };
};


main();

