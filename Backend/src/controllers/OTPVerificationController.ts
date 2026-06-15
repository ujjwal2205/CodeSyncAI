import passwordResetModel from "../models/passwordResetModel";
import userModel from "../models/user";
import bcrypt from "bcrypt";
const OTPVerificationController=async(req:any,res:any)=>{
    const {email,otp,newPassword}=req.body;
    try{
     const normalizedEmail=email.toLowerCase();
     let user=await passwordResetModel.findOne({email:normalizedEmail});
     let info=await userModel.findOne({email:normalizedEmail});
     if(!user){
        return res.json({success:false,message:"OTP Expired"});
     }
     if(user.resetOTP!=otp){
        return res.json({success:false,message:"Invalid OTP"});
     }
     const salt=await bcrypt.genSalt(10);
     const hashedPassword=await bcrypt.hash(newPassword,salt);
     info.password=hashedPassword;
     await info.save();
     return res.json({success:true,message:"Password Changed Successfully!"});
    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default OTPVerificationController;