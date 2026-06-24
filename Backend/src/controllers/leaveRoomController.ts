import userModel from '../models/room';
import roomModel from '../models/room';
const leaveRoomController=async(req:any,res:any)=>{
    const {roomId}=req.body;
    const {userId}=req.user;
    try{
    const room=await userModel.findOne({roomId:roomId});
    if(!room){
        return res.json({success:false,message:"Room not found"});
    }
    if(room.createdBy.toString()===userId){
        await room.deleteOne();
        return res.json({success:true,message:"Room deleted successfully"});
    }
    else{
        room.participants=room.participants.filter((participant:any)=>participant.toString()!==userId);
    }
    await room.save();
    return res.json({success:true,message:"Left the room successfully"});
    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
const kickController=async(req:any,res:any)=>{
    try{
    const {roomId,userId}=req.body;
    const room=await roomModel.findOne({roomId});
    if(!room){
        return res.json({success:false,message:"Room not found"});
    }
    console.log(userId);
    const exists=room.participants.some(
        (id:any)=>id.toString()===userId
    );
    if(!exists){
        return res.json({success:false,message:"User doesn't exist in the room"});
    }
    room.participants = room.participants.filter((id:any)=>id.toString()!==userId);
    room.save();
    return res.json({success:true,message:"User removed successfully!"});
}
catch(error:any){
    console.log(error);
    return res.json({success:false,message:error.message});
}
}
export {kickController,leaveRoomController};
