import roomModel from "../models/room";
const usersInRoom=async(req:any,res:any)=>{
    const {roomId}=req.body;
    try {
        const users=await roomModel.findOne({roomId}).populate("createdBy","userName").populate("participants","userName");
        if(!users){
            return res.json({success:false,message:"No members found"});
        }
        return res.json({success:true,users});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default usersInRoom;