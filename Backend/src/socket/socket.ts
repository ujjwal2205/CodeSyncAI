import { Server } from "socket.io";
import { addUser,removeUser,getAllOnlineUsers,getUserRoom } from "../managers/userManager";
import { setCode,getCode,deleteCode } from "../managers/codeManager";
import { addToRoom,removeFromRoom,getRoomUsers,roomExists } from "../managers/roomManager";

export const initSocket=(io:Server)=>{
    io.on("connection",(socket)=>{
    console.log("New user connected:",socket.id);
    addUser(socket.id,"");
    socket.on("joinRoom",(roomId:string)=>{
        socket.join(roomId);
        addToRoom(socket.id,roomId);
        const code=getCode(roomId);
        if(code){
            socket.emit("codeUpdate",code);
        }
        io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
        io.emit("onlineUsers",getAllOnlineUsers());
        console.log(`User ${socket.id} joined room ${roomId}`);
    })
    socket.on("codeChange",({roomId,code})=>{
        setCode(roomId,code);
        socket.to(roomId).emit("codeUpdate",code);
    })
    socket.on("disconnect",()=>{
        const roomId=getUserRoom(socket.id);
        if(roomId){
            removeFromRoom(socket.id,roomId);
            if(!roomExists(roomId)){
                deleteCode(roomId);
            }
            else{
                io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
            }
        }
        removeUser(socket.id);
        io.emit("onlineUsers",getAllOnlineUsers());
        console.log("User Disconnected:-",socket.id);
    })
})
}