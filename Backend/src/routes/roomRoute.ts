import express from "express";
import createRoomController from "../controllers/createRoomController";
import joinRoomController from "../controllers/joinRoomController";
import authMiddleware from "../middleware/authMiddleware";
const roomRoute=express.Router();
roomRoute.post("/create",authMiddleware,createRoomController);
roomRoute.post("/join",authMiddleware,joinRoomController);
export default roomRoute;