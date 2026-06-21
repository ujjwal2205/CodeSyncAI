import mongoose from "mongoose";
const roomSchema=new mongoose.Schema({
    roomId:{type:String,required:true,unique:true},
    code:{type:String,required:true},
    language:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    maxCapacity:{type:Number,required:true},
    participants:[{type:mongoose.Schema.Types.ObjectId,ref:"user"}]
},{timestamps:true})
const roomModel=mongoose.models.room || mongoose.model("room",roomSchema);
export default roomModel;
