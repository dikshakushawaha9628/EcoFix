const mongoose = require('mongoose');
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerificationTemplate")
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:'15m',
    },
});
// otp ka mail krenge... and submit krne par otp ko verify krenge... agar sahi hai to user ko login karne denge... nahi to error de denge
// function -> to send emails
async function sendVerificationEmail(email,otp){
    try{
       const mailResponse = await mailSender(email, "Verification Email from Edunotion", `Your OTP is ${otp}`); 
       console.log("Mail sent successfully: ",mailResponse);
    } catch(err){
        console.log("Error Occured while sending mails",err);
    }
}
otpSchema.pre("save", function(next){
     sendVerificationEmail(this.email, this.otp).then(()=>next()).catch((err)=>{
        console.error("error while sending mail");
        next(err);
     });
   
})

module.exports = mongoose.model('Otp', otpSchema);