import express from "express";
import {signUp,logIn,logOut,googleLogin} from "../controllers/userController";
const userRouter=express.Router();
userRouter.post("/signup",signUp);
userRouter.post("/login",logIn);
userRouter.post("/logout",logOut);
userRouter.post("/googleLogin",googleLogin);
export default userRouter;