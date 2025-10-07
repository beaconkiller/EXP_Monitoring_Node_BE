const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { stdout } = require('process');



let config = {
    "data": [
        {
            "path": "EXP_Monitoring_BE",
            "branch": "master",
        },
        {
            "path": "EXP_Monitoring_NG_FE",
            "branch": "master",
        }
    ],
    "key": ""
}



async function main() {
    const args = process.argv.slice(2);

    if (args.length == 0) {
        console.log(' ');
        console.log('=============================')
        console.log('- Arguments cannot be empty -')
        console.log('=============================')
        console.log(' ');
        return;
    }

    console.log(args);

    try {
        baseDir = path.join(
            __dirname,  // JS_SCRIPTS FOLDER
            '..',       // ROOT APP FOLDER
            '..'        // PARENT ROOT FOLDER
        )

        for (var el of config['data']) {
            proj_dir = path.join(baseDir, el['path']);
            let cmd = ''
                + 'cd ' + proj_dir+ ' && ' 
                + 'git add . && ' 
                + 'git commit -m "quicksave : '+args+'" && '
                + 'git push origin '+el['branch']
            ;


            let _res = await new Promise((resolve, reject) => {
                exec(cmd, (err, stdout) => {
                    if (err) reject(err);
                    resolve(stdout);
                })
            })

            // console.log(_res);
        }
    } catch (error) {
        console.error(error);
    }
};


main();

