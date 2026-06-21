import roomModel from "../models/room";
function generateRoomId():string{
const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digits="0123456789";
let roomId="";
for(let i=0;i<3;i++){
    roomId+=letters.charAt(Math.floor(Math.random() * letters.length));
}
for(let i=0;i<3;i++){
    roomId+=digits.charAt(Math.floor(Math.random() * digits.length));
}
return roomId;
}
const createRoomController=async(req:any,res:any)=>{
    const {maxCapacity}=req.body;
    const {userId}=req.user;
    try{
    let roomId=generateRoomId();
    while(await roomModel.findOne({roomId})){
     roomId=generateRoomId();
    }
    const newRoom=await roomModel.create({
        roomId,
        code:"// Start coding...",
        language:"javascript",
        createdBy:userId,
        maxCapacity:maxCapacity,
        participants:[userId]
    })
    return res.json({success:true,roomId:newRoom.roomId});    
    }
    catch(error:any){
        console.log(error);
        return res.json({success:false,message:error.message});
    }
}
export default createRoomController;
