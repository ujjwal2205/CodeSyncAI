import { getUser} from "./userManager";
const rooms=new Map<string,Set<string>>();
const roomOwners=new Map<string,string>();
const roomSettings=new Map<string,{requireApproval:boolean}>();
export const addToRoom=(socketId:string,roomId:string)=>{
    if(!rooms.has(roomId)){
        rooms.set(roomId,new Set<string>());
    }
    rooms.get(roomId)!.add(socketId);
};
export const removeFromRoom=(socketId:string,roomId:string)=>{
const room=rooms.get(roomId);
if(!room){
    return;
}    
room.delete(socketId);
if(room.size===0){
    rooms.delete(roomId);
}
};
export const getRoomUsers=(roomId:string)=>{
    const roomUsers=Array.from(rooms.get(roomId)||[]);
    return roomUsers.map((socketId)=>{
        const user=getUser(socketId);
        return{
            socketId,
            userName:user?.userName || "Anonymous"
        }
    })
};
export const roomExists = (roomId: string) => {
    return rooms.has(roomId);
};
export const setRoomOwner=(roomId:string,socketId:string)=>{
if(!roomOwners.has(roomId)){
    roomOwners.set(roomId,socketId);
}
}
export const getRoomOwner=(roomId:string)=>{
    if(!roomOwners.has(roomId)){
        return;
    }
    return roomOwners.get(roomId);
}
export const setRoomSettings=(roomId:string,requireApproval:boolean)=>{
    roomSettings.set(roomId,{requireApproval});
}
export const getRoomSetting=(roomId:string)=>{
    return roomSettings.get(roomId);
}
export const closeRoom=(roomId:string)=>{
    rooms.delete(roomId);
    roomOwners.delete(roomId);
    roomSettings.delete(roomId);
}