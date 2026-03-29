const rooms=new Map<string,Set<string>>();
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
    return Array.from(rooms.get(roomId) || []);
};
export const roomExists = (roomId: string) => {
    return rooms.has(roomId);
};
