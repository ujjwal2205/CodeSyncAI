import cors from "cors";
import express from "express";
import {Server} from "socket.io";
import http from "http";
import {initSocket} from "./socket/socket";
import {connectDB} from "./config/db";
import userRouter from "./routes/userRoute";
import passwordResetRouter from "./routes/passwordResetRoute";
import roomRoute from "./routes/roomRoute";
import chatRoute from "./routes/chatRoute";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
connectDB();
const port=4000;
const app=express();
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}));
app.use(cookieParser());
app.use(express.json());
app.use("/api/user",userRouter);
app.use("/api/forgot-password",passwordResetRouter);
app.use("/api/room",roomRoute);
app.use("/api/chat",chatRoute);

const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
})
initSocket(io);

server.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})