import chatModel from "../models/chatModel";
import roomModel from "../models/room";
import { askGemini } from "../services/gemini";
const getMessages=async(req:any,res:any)=>{
    const {roomId,type}=req.body;
    try{
    const room=await roomModel.findOne({roomId});
    if(!room){
     return res.json({success:false,message:"Room not found"});
    }
    const messages=await chatModel.find({roomId,type}).populate("senderId","userName").sort({createdAt:1});
    return res.json({success:true,messages});
    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
const addMessagesGroup=async(req:any,res:any)=>{
    const {roomId,message}=req.body;
    const {userId}=req.user;
    try {
        const room=await roomModel.findOne({roomId});
        if(!room){
            return res.json({success:false,message:"Room not found"});
        }
        if(!message?.trim()){return res.json({success:false,message:"Message is required"});}
        await chatModel.create({
            roomId,
            type:"group",
            role:"user",
            senderId:userId,
            message
        })
        return res.json({success:true});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
const addMessagesAI=async(req:any,res:any)=>{
    const {roomId,message}=req.body;
    const {userId}=req.user;
    try {
        const room=await roomModel.findOne({roomId});
        if(!room){
            return res.json({success:false,message:"Room not found"});
        }
        if(!message?.trim()){return res.json({success:false,message:"Message is required"});}
        const newMessage:any={
            roomId,
            type:"ai",
            role:"user",
            senderId:userId,
            message
        }
        await chatModel.create(newMessage);
        const aiReply= await askGemini(message);
        await chatModel.create({
            roomId,
            type:"ai",
            role:"assistant",
            message:aiReply
        })
        return res.json({success:true,aiReply});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
const deleteChats=async(req:any,res:any)=>{
    const {roomId}=req.body;
    try {
        const room=await roomModel.findOne({roomId});
        if(room){
            return res.json({success:false,message:"Room still exists"});
        }
        await chatModel.deleteMany({roomId});
        return res.json({success:true});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export {getMessages,addMessagesGroup,addMessagesAI,deleteChats};