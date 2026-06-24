import { Server } from "socket.io";
import { addUser,removeUser,getAllOnlineUsers,getUserRoom, getUser, getSocketIdByUserId } from "../managers/userManager";
import { setCode,getCode,deleteCode } from "../managers/codeManager";
import { addToRoom,removeFromRoom,getRoomUsers,roomExists, setRoomOwner, getRoomOwner, closeRoom, acquireEditorLock, releaseEditorLock } from "../managers/roomManager";

export let io: Server;
export const initSocket=(socketServer:Server)=>{
    io=socketServer;
    io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
    socket.on("joinRoom",async({roomId,userName,isOwner,userId})=>{
        socket.join(roomId);
      
        addUser(socket.id,roomId,userName,userId);
        addToRoom(socket.id,roomId);
        if(isOwner){
            setRoomOwner(roomId,socket.id);
        }
        io.to(roomId).emit(
            "roomUsers",
            getRoomUsers(roomId)
        );
        const code=await getCode(roomId);
        if(code){
            socket.emit("codeUpdate",code);
        }
    })
    socket.on("codeChange",({roomId,code})=>{
        const allowed=acquireEditorLock(roomId,socket.id);
        if(!allowed){
            socket.emit("editorLocked","Another user is typing");
            return;
        }
        setCode(roomId,code);
        socket.to(roomId).emit("codeUpdate",code);
    })
    socket.on("languageChange",({roomId,language})=>{
        socket.to(roomId).emit("languageUpdate",language);
    })
    socket.on("typing",({roomId,userName})=>{
        socket.to(roomId).emit("userTyping",{userName});
    })
    socket.on("stopTyping",({roomId,userName})=>{
        releaseEditorLock(roomId,socket.id);
        socket.to(roomId).emit("userStoppedTyping",{userName});
    })
    socket.on("cursorMove",({roomId,position,userName})=>{
        socket.to(roomId).emit("cursorUpdate",{
            position,
            userName
        })
    })
    socket.on("runCode",({roomId,output})=>{
        socket.to(roomId).emit("runCodeUpdate",(output));
    })
    socket.on("customInput",({roomId,input})=>{
        socket.to(roomId).emit("customInputChange",(input));
    })
    socket.on("kick",({roomId,userId})=>{
        const targetSocketId=getSocketIdByUserId(userId);
        if(!targetSocketId) return;
        io.to(targetSocketId).emit("kicked");
        const targetSocket = io.sockets.sockets.get(targetSocketId);
        if(targetSocket){
       targetSocket.leave(roomId);
       }
        removeUser(targetSocketId);
        removeFromRoom(targetSocketId,roomId);
        io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
    })
    socket.on("sendGroupMessage",({roomId,message})=>{
        const user=getUser(socket.id);
        if(!user) return;
        socket.to(roomId).emit("receiveGroupMessage",{message,senderId:{userName:user.userName}});
    })
    socket.on("disconnect",()=>{
        const roomId=getUserRoom(socket.id);
        if(roomId){
            const ownerId=getRoomOwner(roomId);
            if(ownerId===socket.id){
                io.to(roomId).emit("roomClosed");
                deleteCode(roomId);
                closeRoom(roomId);
                console.log("User Disconnected:-",socket.id);
                return;
            }
            removeUser(socket.id);
            removeFromRoom(socket.id,roomId);
            if(!roomExists(roomId)){
                deleteCode(roomId);
            }
            else{
                io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
            }
        }
        io.emit("onlineUsers",getAllOnlineUsers());
        console.log("User Disconnected:-",socket.id);
    })
})
}