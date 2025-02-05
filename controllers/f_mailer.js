var nodeMailer = require('nodemailer');

exports.sendMail = async() => {
    console.log("\n ============= SENDMAIL ============= \n")
    
    mail_id = process.env.MAIL_ID;
    mail_pw = process.env.MAIL_PW;

    console.log(nodeMailer);
}