import roomModel from "../models/room";
const languageChangeController=async(req:any,res:any)=>{
    const {roomId,language}=req.body;
    try {
        const room=await roomModel.findOne({roomId});
        if(!room){
            return res.json({success:false,message:"Room not found"});
        }
        room.language=language;
        room.code="// Start Typing...";
        await room.save();
        return res.json({success:true});
    } catch (error:any) {
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
const getLanguage=async(req:any,res:any)=>{
    const {roomId}=req.body;
    try{
     const room=await roomModel.findOne({roomId});
      if(!room){
            return res.json({success:false,message:"Room not found"});
      }
      return res.json({success:true,language:room.language});

    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export {getLanguage,languageChangeController};