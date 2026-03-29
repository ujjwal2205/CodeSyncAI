const roomCode=new Map<string,string>();
export const setCode=(roomId:string,code:string)=>{
    roomCode.set(roomId,code);
}
export const getCode=(roomId:string)=>{
    return roomCode.get(roomId);
}
export const deleteCode=(roomId:string)=>{
    roomCode.delete(roomId);
}