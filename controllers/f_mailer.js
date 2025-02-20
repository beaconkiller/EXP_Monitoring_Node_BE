var nodeMailer = require('nodemailer');

exports.sendMail = async(mail_to, str) => {
    // console.log("\n ============= SENDMAIL ============= \n")

    if(mail_to != null || mail_to != undefined){
        try {
            mail_id = process.env.MAIL_ID;
            mail_pw = process.env.MAIL_PW;
        
            const transporter = nodeMailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: mail_id,
                    pass: 'nuay jacj naym gcvs'
                },
               });        
              
            var mailOptions = {
                from: mail_id,
                to: mail_to,
                subject: 'EApproval - Mail Notifications',
                html: str
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } catch (error) {
            console.log(error)
        }
    }
}