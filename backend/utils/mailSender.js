const nodemailer = require('nodemailer');
require("dotenv").config();
const mailSender = async (email, title, body) =>{
    try{
        
       const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port:587,
            secure:false,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });
        
        let info = await transporter.sendMail({
            from: '"Ecofix || Save Nature" <' + process.env.MAIL_USER + '>',
            to: `${email}`,
            subject:`${title}`,
            html: `${body}`,
        });
        console.log("2 step")
        console.log(info);
        return info;
    } catch(err){
         console.error("Error sending email:", err.message);
            return { success: false, error: err.message };
    }
}
module.exports = mailSender;
