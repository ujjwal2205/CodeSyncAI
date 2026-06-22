import mongoose from "mongoose";
const chatSchema=new mongoose.Schema({
    roomId:{type:String,required:true},
    type:{type:String,enum:["group","ai"],required:true},
    role:{type:String,enum:["user","assistant"]},
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:"user"},
    message:{type:String}
},{timestamps:true})
const chatModel=mongoose.models.chat || mongoose.model("chat",chatSchema);
export default chatModel;