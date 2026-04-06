    type User={
    userName:string;
    roomId:string;
}
    const onlineUsers=new Map<string,User>();
export const addUser=(socketId:string,roomId:string,userName:string)=>{
onlineUsers.set(socketId,{userName,roomId});
}
export const removeUser=(socketId:string)=>{
    onlineUsers.delete(socketId);
}
export const getAllOnlineUsers = () => {
    return Array.from(onlineUsers.entries()).map(([id, user]) => ({
        socketId: id,
        userName: user.userName
    }));
};
export const getUserRoom=(socketId:string)=>{
    return onlineUsers.get(socketId)?.roomId;
}
export const getUser=(socketId:string)=>{
    return onlineUsers.get(socketId);
}