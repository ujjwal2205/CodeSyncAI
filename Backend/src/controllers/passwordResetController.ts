import userModel from "../models/user";
import passwordResetModel from "../models/passwordResetModel";
import nodemailer from "nodemailer";
const passwordResetController=async(req:any,res:any)=>{
    const {email}=req.body;
    try{
     const normalizedEmail=email.toLowerCase();
     let exist=await userModel.findOne({email:normalizedEmail});
     if(!exist){
        return res.json({success:false,message:"User doesn't exist!"});
     }
     if(exist.authType!=="local"){
        return res.json({success:false,message:`Please log in with ${exist.authType}`});
     }
     const otp=Math.floor(Math.random()*(9999-1000+1)+1000);
     const newUser=new passwordResetModel({
        email:normalizedEmail,
        resetOTP:otp,
        resetOTPExpiry:new Date()
     })
     await newUser.save();
     const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{user:process.env.EMAIL_USER,pass:process.env.EMAIL_PASS}
     });
     await transporter.sendMail({
        to:email,
        subject:"CodeSyncAI Password Reset OTP",
        html:`<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
     })
     return res.json({success:true,message:"OTP sent to your email!"});
    }
    catch(error:any){
    console.log(error);
    return res.json({success:false,message:error.message});
    }
}
export default passwordResetController;