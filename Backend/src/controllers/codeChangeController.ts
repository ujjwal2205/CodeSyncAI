import roomModel from "../models/room";
async function codeChangeController(req:any,res:any){
    const {roomId,code}=req.body;
   try{
    const room=await roomModel.findOneAndUpdate({roomId},{code},{new:true});
    if(!room){
        return res.json({success:false,message:"Room not found"});
    }
    return res.json({success:true});
   }
   catch(error:any){
    console.log(error);
    return res.json({success:false,message:error.message});
   }
}
export default codeChangeController;