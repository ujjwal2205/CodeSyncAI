import { Server } from "socket.io";
import { addUser,removeUser,getAllOnlineUsers,getUserRoom } from "../managers/userManager";
import { setCode,getCode,deleteCode } from "../managers/codeManager";
import { addToRoom,removeFromRoom,getRoomUsers,roomExists, setRoomOwner, getRoomOwner, closeRoom } from "../managers/roomManager";

export const initSocket=(io:Server)=>{

    io.on("connection",(socket)=>{
    console.log("Connected:",socket.id);
    socket.on("joinRoom",({roomId,userName,isOwner})=>{
        socket.join(roomId);
        addUser(socket.id,roomId,userName);
        addToRoom(socket.id,roomId);
        if(isOwner){
            setRoomOwner(roomId,socket.id);
        }
        io.to(roomId).emit(
            "roomUsers",
            getRoomUsers(roomId)
        );
        const code=getCode(roomId);
        if(code){
            socket.emit("codeUpdate",code);
        }
    })
    socket.on("codeChange",({roomId,code})=>{
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
        socket.to(roomId).emit("userStoppedTyping",{userName});
    })
    socket.on("cursorMove",({roomId,position,userName})=>{
        socket.to(roomId).emit("cursorUpdate",{
            position,
            userName
        })
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