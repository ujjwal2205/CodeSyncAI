import roomModel from "../models/room";
const joinRoomController=async(req:any,res:any)=>{
    const {roomId}=req.body;
    const {userId}=req.user;
    try{
        const room=await roomModel.findOne({roomId});
        if(!room){
            return res.json({success:false,message:"Room not found"});
        }
        if(room.participants.length>=room.maxCapacity){
            return res.json({success:false,message:"Room is full"});
        }
        room.participants.push(userId);
        room.save();
        return res.json({success:true,message:"Joined room successfully"}); 
    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default joinRoomController;