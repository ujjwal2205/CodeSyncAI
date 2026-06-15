import passwordResetController from "../controllers/passwordResetController";
import OTPVerificationController from "../controllers/OTPVerificationController";
import express from "express";
const passwordReset=express.Router();
passwordReset.post("/otp",passwordResetController);
passwordReset.post("/verification",OTPVerificationController);
export default passwordReset;