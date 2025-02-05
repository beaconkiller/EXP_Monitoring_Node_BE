const path = require("path");
const fs = require('fs');


exports.file_upload = async(file_name, base64_data, path_to) => {

    console.log("\n ========= file_upload ========= \n");

    console.log(file_name);
    console.log(base64_data);

    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------- NOTE TO FUTURE ASS SELF ----------------------------------
    // ---------------------------------------------------------------------------------------------
    // ---- BEFORE WRITING THE FILE TO DISK, SPLIT THE CONVERTED BASE64 STRING BY COMMAS, THEN -----
    // ---- SELECT THE SECOND ELEMENT. CUS THATS THE REAL FILE, THE FIRST ELEMENT IS THE HEADER ---- 
    // ---- DO IT LIKE WE DID BELOW. --------------------------------------------------------------- 
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------

    let fileData =  base64_data.split(',')[1]
    const binary_data = Buffer.from(fileData, 'base64')

    // console.log(fileData);

    fs.writeFile(path_to + '/' + file_name, binary_data, function (err) {
        if (err) {
            console.log(err)
        }
    })
}


exports.get_timestamp_string = () => {
    const act_date = new Date();
    const dd = String(act_date.getDate()).padStart(2, '0'); 
    const mm = String(act_date.getMonth() + 1).padStart(2, '0'); 
    const yy = String(act_date.getFullYear()).slice(-2); 
    const hh = String(act_date.getHours()).padStart(2, '0'); 
    const minutes = String(act_date.getMinutes()).padStart(2, '0'); 
    const ss = String(act_date.getSeconds()).padStart(2, '0'); 


    return `${dd}${mm}${yy}_${hh}${minutes}${ss}`;
}
