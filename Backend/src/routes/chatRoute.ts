import { getMessages,addMessagesAI,addMessagesGroup,deleteChats } from "../controllers/chatController";
import authMiddleware from "../middleware/authMiddleware";
import express from "express";
const chatRoute=express.Router();
chatRoute.post("/get-messages",authMiddleware,getMessages);
chatRoute.post("/addMessagesAI",authMiddleware,addMessagesAI);
chatRoute.post("/addMessagesGroup",authMiddleware,addMessagesGroup);
chatRoute.post("/deleteChats",authMiddleware,deleteChats);
export default chatRoute;