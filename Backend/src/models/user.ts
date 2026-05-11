import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    userName:{type:String,required:true,unique:true,trim:true},
    email:{type:String,unique:true,required:true,lowercase:true},
    password:{
        type:String,
        required:function(){
            return this.authType=='local';
        }
    },
    googleId:{type:String},
    authType:{type:String,required:true},
},{timestamps:true})
const userModel=mongoose.models.user || mongoose.model("user",userSchema);
export default userModel;