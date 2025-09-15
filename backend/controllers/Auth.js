const OTP =require("../models/Otp");
const otpGenerator = require("otp-generator");
const User = require("../models/User");
 const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Profile = require("../models/Profile"); 


// ++++++sendOTP+++++++++++
exports.sendOTP = async (req,res)=>{
   try{
        //fetch email from req body
        const {email} = req.body;
        // check if user already exists
        const checkUserPresent = await User.findOne({email});
        // if exists return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already exists",
            })
        }

        // if not create a new user and generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("Otp Generated: ", otp);
        // check unique otp or not
        // this is a brute force method because we are checking the otp in the database again and again
        const result = await OTP.findOne({otp:otp});
        while(result){
            otp = otpGenerator.generate(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        const result = await OTP.findOne({otp:otp});
        }
        // entry in database for otp
        const otpPayload = {email, otp};
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        // return response
        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp,
        })

   } catch (err){
    console.log(err);
    res.status(500).json({
        success:false,
        message:err.message,
    })
   }
}

// ++++++++sign up+++++++
exports.signUp = async (req,res)=>{
    try{
        //fetch data from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp, 
            contactNumber,

        } = req.body;
        // validate the data
        if(!firstName || !lastName || !email || !password || !confirmPassword){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields",
            });
        }

        // 2 password and confirm password
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match",
            });
        }   
        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }

        // find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp); 
      

        // validate the OTP
        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:"OTP not found",
            });
        } else if (otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
     
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
           // create entry in database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // return response
        res.status(200).json({
            success:true,
            message:"User created successfully",
            user,
        })
    } catch (err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered please try again",
        })
    }
}
// ++++++login++++++++++++++
exports.login = async(req,res)=>{
    try {
        //get data from req body
        const {email,password}=req.body;
        //validate the data
         if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields",
            });
         }
        //check user esist or not
         const user = await User.findOne({email});
         if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found. Please sign up",
            });
         }
        //generate JWT after password matching
        console.log("User:",user);
         if(await bcrypt.compare(password, user.password)){
            const payload = {
                id:user._id,
                email:user.email,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:'4h',
            });
            user.token = token;
            user.password = undefined;
 //create cookie and send response
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
           res.cookie("token",token,options).status(200).json({
            success:true,
            token,
            user,
            message:"User logged in successfully",
           }) 
            
         }
       else {
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",
            });
         }
       }
    catch (err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failed ",
        });
    }
}

//++++++++++change password+++++++++
exports.changePassword = async (req,res)=>{
    try {
        //get data from req body
        const {oldPassword, newPassword, confirmPassword} = req.body;
        //validate the data
        if(!oldPassword || !newPassword || !confirmPassword){
            return res.status(403).json({
                success:false,
                message:"Please fill all the fields",
            });
        }
        //get oldPassword, newPassword, confirmPassword
        
        // validate the password
        if(newPassword !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirm password do not match",
            });
        }

        // check if user exists
        const user = await User.findById(req.user.id);  
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found",
            });
        }

        // check if old password is correct
        if(!await bcrypt.compare(oldPassword, user.password)){
            return res.status(401).json({
                success:false,
                message:"Old password is incorrect",
            });
        }   
        // hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // update password in database:
        user.password = hashedPassword;
        await user.save();  
        // send mail of password updated :
        const mailBody = `<h1>Password Updated</h1>
        <p>Your password has been updated successfully</p>
        <p>If you did not request this change, please contact us immediately</p>
        <p>Thank you</p>`;
        const mailTitle = "Password Updated";
       
        const mailResponse = await mailSender(user.email, mailTitle, mailBody);
        console.log(mailResponse);




        //return response
        res.status(200).json({
            success:true,
            message:"Password changed successfully",
        })
    } catch (err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Something went wrong",
        })
    }

}