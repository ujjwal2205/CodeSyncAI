import { getUser} from "./userManager";
const rooms=new Map<string,Set<string>>();
const roomOwners=new Map<string,string>();
const roomEditorLock=new Map<string,string>();
export const addToRoom=(socketId:string,roomId:string)=>{
    if(!rooms.has(roomId)){
        rooms.set(roomId,new Set<string>());
    }
    rooms.get(roomId)!.add(socketId);
    console.log(rooms);
};
export const removeFromRoom=(socketId:string,roomId:string)=>{
const room=rooms.get(roomId);
if(!room){
    return;
}    
room.delete(socketId);
 if(room.size === 0){
        rooms.delete(roomId);
    }
console.log(rooms);
};
export const getRoomUsers=(roomId:string)=>{
    const roomUsers=Array.from(rooms.get(roomId)||[]);
    return roomUsers.map((socketId)=>{
        const user=getUser(socketId);
        const ownerSocket=roomOwners.get(roomId);
        
        return{
            socketId,
            userName:user?.userName || "Anonymous",
            isOwner:socketId===ownerSocket,
            _id:user?.userId
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

export const closeRoom=(roomId:string)=>{
    rooms.delete(roomId);
    roomOwners.delete(roomId);
}
export const acquireEditorLock=(roomId:string,socketId:string)=>{
    const currentUser=roomEditorLock.get(roomId);
    if(currentUser && currentUser!==socketId){
        return false;
    }
    roomEditorLock.set(roomId,socketId);
    return true;
}
export const releaseEditorLock=(roomId:string,socketId:string)=>{
    if(roomEditorLock.get(roomId)===socketId){
        roomEditorLock.delete(roomId);
    }
}