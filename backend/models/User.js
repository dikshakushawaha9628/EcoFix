const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        trim:true,
    },
    lastName : {
        type : String,
        required: true,
        trim: true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum : ["Admin","User","Worker"],
        required:true,
    },
    points:{
        type:Number,
        required:true,
        default:0,
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
   
    image:{
        type:String,
        required:true,
    },
   
    token :{
        type:String,

    },
    resetPasswordExpires: {
        type:Date,
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User;