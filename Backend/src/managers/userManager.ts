const onlineUsers=new Map<string,string>();
export const addUser=(socketId:string,roomId:string)=>{
onlineUsers.set(socketId,roomId);
}
export const removeUser=(socketId:string)=>{
    onlineUsers.delete(socketId);
}
export const getAllOnlineUsers=()=>{
    return Array.from(onlineUsers.keys());
}
export const getUserRoom=(socketId:string)=>{
    return onlineUsers.get(socketId);
}