import mongoose from "mongoose";
const passwordReset=new mongoose.Schema({
    email:{type:String,required:true},
    resetOTP:{type:String,required:true},
    resetOTPExpiry:{type:Date,expires:600}
})
const passwordResetModel=mongoose.models.password || mongoose.model("password",passwordReset);
export default passwordResetModel;