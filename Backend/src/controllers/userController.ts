import userModel from "../models/user";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import verifyGoogleToken from "../middleware/googleAuth";

const createToken=(user:any)=>{
    return jwt.sign({userId:user._id},process.env.JWT_SECRET!,{expiresIn:"7d"})
}
//SignUp
const signUp=async(req:any,res:any)=>{
    const {userName,email,password,confirmPassword}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        const normalizedUserName=userName.toLowerCase();
        const exists=await userModel.findOne({email:normalizedEmail});
        const exists2=await userModel.findOne({userName:normalizedUserName});
        if(exists){
            return res.status(400).json({success:false,message:"User already exists"});
        }
        if(exists2){
            return res.status(400).json({success:false,message:"Username already taken"});
        }
        if(!validator.isEmail(normalizedEmail)){
            return res.status(400).json({success:false,message:"Invalid email"});
        }
        if(password!==confirmPassword){
            return res.status(400).json({success:false,message:"Passwords do not match"});
        }
        if(password.length<8){
            return res.status(400).json({success:false,message:"Password must be at least 8 characters"});
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await userModel.create({
            userName:normalizedUserName,
            email:normalizedEmail,
            password:hashedPassword,
            authType:"local"
        });
        const token=createToken(newUser);
        res.cookie("token",token,{
            httpOnly:true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure:process.env.NODE_ENV==="production",
            maxAge:7*24*60*60*1000
        });
        res.status(201).json({success:true,message:"Login Successful!",token});
    } catch (error:any) {
        res.status(500).json({success:false,message:error.message});
    }
}
//Log In

const logIn=async(req:any,res:any)=>{
    const {email,password}=req.body;
    try {
        const normalizedEmail=email.toLowerCase();
        const user=await userModel.findOne({email:normalizedEmail});
        if(!user){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }
        if(user.authType!=="local"){
            return res.status(400).json({success:false,message:`Please log in with ${user.authType}`});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message:"Invalid credentials"});
        }
        const token=createToken(user);
        res.cookie("token",token,{
            httpOnly:true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure:process.env.NODE_ENV==="production",
            maxAge:7*24*60*60*1000
        });
        res.status(200).json({success:true,message:"Login Successful!",token});
    } catch (error:any) {
        res.status(500).json({success:false,message:error.message});
    }
}
//Log Out
const logOut=async(req:any,res:any)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure:process.env.NODE_ENV==="production"
        });
        return res.json({success:true,message:"Logged Out Successfully!"});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
//googleLogin
const googleLogin=async(req:any,res:any)=>{
    try {
        const {idToken}=req.body;
        const googleUser=await verifyGoogleToken(idToken);
        const {email,given_name}=googleUser!;
        const normalizedEmail=email?.toLowerCase();
        let user=await userModel.findOne({email:normalizedEmail});
        if(user && user.authType!=="google"){
            return res.status(400).json({success:false,message:`Please log in with ${user.authType}`});
        }
        if(!user){
            let normalizedUserName=given_name?.toLowerCase().trim()||normalizedEmail?.split("@")[0];
            let count=1;
            while(await userModel.findOne({userName:normalizedUserName})){
                normalizedUserName=`${normalizedUserName}${count}`;
                count++;
            }
            user=new userModel({
                userName:normalizedUserName,
                email:normalizedEmail,
                authType:"google"
            });
            await user.save();
        }
        const token=createToken(user);
        res.cookie("token",token,{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge:7*24*60*60*1000
        });
        res.status(200).json({success:true,message:"Login Successful!",token})
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
    }
}
// fetch user details
const fetchUserDetails=async(req:any,res:any)=>{
    try {
        const {userId}=req.user;
        const user=await userModel.findById(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"});
        }
        return res.status(200).json({success:true,userName:user.userName,email:user.email});
    } catch (error:any) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
    }
}
export {signUp,logIn,logOut,googleLogin,fetchUserDetails};