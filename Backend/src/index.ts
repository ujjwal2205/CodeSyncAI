import cors from "cors";
import express from "express";
import {Server} from "socket.io";
import http from "http";
import {initSocket} from "./socket/socket";
import {connectDB} from "./config/db";
import dotenv from "dotenv";
dotenv.config();
connectDB();
const port=4000;
const app=express();
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"*",
    }
})
initSocket(io);
server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})