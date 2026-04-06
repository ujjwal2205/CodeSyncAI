import { Server } from "socket.io";
import { addUser,removeUser,getAllOnlineUsers,getUserRoom } from "../managers/userManager";
import { setCode,getCode,deleteCode } from "../managers/codeManager";
import { addToRoom,removeFromRoom,getRoomUsers,roomExists, setRoomOwner, setRoomSettings, getRoomOwner, getRoomSetting, closeRoom } from "../managers/roomManager";

export const initSocket=(io:Server)=>{

    io.on("connection",(socket)=>{
    console.log("New user connected:",socket.id);
    socket.on("createRoom",({roomId,userName,requireApproval})=>{
        socket.join(roomId);
        setRoomOwner(roomId,socket.id);
        setRoomSettings(roomId,requireApproval);
        addUser(socket.id,roomId,userName);
        addToRoom(socket.id,roomId);
        socket.emit("roomCreated",{roomId});
    })
    socket.on("requestJoin",({roomId,userName})=>{
        const ownerId=getRoomOwner(roomId);
        const ownerSocket=io.sockets.sockets.get(ownerId!)
        const setting=getRoomSetting(roomId);
        if(!ownerId){
            socket.emit("roomNotExists","No Room Exist with this roomId");
            return;
        }
       if(!setting?.requireApproval){
           addUser(socket.id,roomId,userName);
           socket.join(roomId);
           addToRoom(socket.id,roomId);
           const code=getCode(roomId);
           if(code){
               socket.emit("codeUpdate",code);
            }
            io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
            io.emit("onlineUsers",getAllOnlineUsers());
            socket.emit("joinApproved",{roomId})
            console.log(`User ${socket.id} joined room ${roomId}`);
            return;
       }
       io.to(ownerId).emit("joinRequest",{
        socketId:socket.id,
        userName,
        roomId
       });
       socket.emit("waitingForApproval");
    })
    socket.on("approveJoin",({socketId,roomId,userName})=>{
        const ownerId=getRoomOwner(roomId);
        if(socket.id!==ownerId) return;
        const targetSocket=io.sockets.sockets.get(socketId);
        if(!targetSocket){
            return;
        }
        targetSocket.join(roomId);
        addUser(socketId,roomId,userName);
        addToRoom(socketId,roomId);
        targetSocket.emit("joinApproved",{roomId});
        io.to(roomId).emit("roomUsers",getRoomUsers(roomId));
    });
    socket.on("rejectJoin",({socketId,roomId})=>{
        const ownerId=getRoomOwner(roomId);
        if(socket.id!==ownerId) return;
        const targetSocket=io.sockets.sockets.get(socketId);
        targetSocket?.emit("joinRejected");
    })
    socket.on("toggleApproval",({roomId,requireApproval})=>{
     const ownerId=getRoomOwner(roomId);
     if(socket.id!==ownerId){
        return;
     }
     setRoomSettings(roomId,requireApproval);
     io.to(roomId).emit("approvalModeChanged",{requireApproval});
    });
    socket.on("codeChange",({roomId,code})=>{
        setCode(roomId,code);
        socket.to(roomId).emit("codeUpdate",code);
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
                deleteCode(roomId);
                closeRoom(roomId);
                io.to(roomId).emit("roomClosed");
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