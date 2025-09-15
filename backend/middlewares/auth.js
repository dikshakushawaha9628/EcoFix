 const jwt = require('jsonwebtoken');
 require('dotenv').config();
    const User = require('../models/User');
 // auth
exports.auth = async (req,res,next)=>{
    try{
        //extract token from header
        const token = req.cookies.token
                    || req.body.token
                    || req.header("Authorization").replace("Bearer ","");
        //if token is missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            });
        }
        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        } catch (error){
            // verification - issue
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
        }
        next();
    } catch (err){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token.'
        });

    } 
}
 // isAdmin
exports.isAdmin  = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route fot Admin only"
            });
        } next();
    } catch (err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the role"
        });
    }
}  
 // isUser
exports.isUser = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "User"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for User only"
            });
        } next();
    } catch (err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the role"
        });
    }
}  

 // isWorker
exports.isWorker  = async (req,res,next)=>{
    try{
        if(req.user.accountType !== "Worker"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route fot Worker only"
            });
        } next();
    } catch (err){
        console.log(err);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while verifying the role"
        });
    }
}  
