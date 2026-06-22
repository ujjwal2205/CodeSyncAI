import roomModel from "../models/room";
const getCodeController=async(req:any,res:any)=>{
    const {roomId}=req.body;
    try {
        const room=await roomModel.findOne({roomId});
        if(!room){
            return res.json({success:false,message:"Room not found!"});
        }
        const code=room.code;
        return res.json({success:true,code});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default getCodeController;