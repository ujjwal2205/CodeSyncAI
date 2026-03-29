import cors from "cors";
import express from "express";
import {Server} from "socket.io";
import http from "http";
const port=4000;
const app=express();
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
    }
})
const onlineUsers=new Map<string,string>();
const rooms=new Map<string,Set<string>>();
io.on("connection",(socket)=>{
    console.log("New user connected:",socket.id);
    socket.on("joinRoom",(roomId:string)=>{
        socket.join(roomId);
        onlineUsers.set(socket.id,roomId);
        if(!rooms.has(roomId)){
            rooms.set(roomId,new Set<string>());
        }
        rooms.get(roomId)!.add(socket.id);
        io.to(roomId).emit("roomUsers",Array.from(rooms.get(roomId)!));
        console.log(`User ${socket.id} joined room ${roomId}`);
    })
    socket.on("disconnect",()=>{
        const roomId=onlineUsers.get(socket.id);
        if(roomId){
            rooms.get(roomId)?.delete(socket.id);
            if(rooms.get(roomId)?.size===0){
                rooms.delete(roomId);
            }
            io.to(roomId).emit("roomUsers",Array.from(rooms.get(roomId) || []));
        }
        onlineUsers.delete(socket.id);
     io.emit("onlineUsers",Array.from(onlineUsers.keys()));
     console.log("User disconnected. Online Users:",onlineUsers);
    })
})
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})