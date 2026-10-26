"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passwordResetController_1 = __importDefault(require("../controllers/passwordResetController"));
const OTPVerificationController_1 = __importDefault(require("../controllers/OTPVerificationController"));
const express_1 = __importDefault(require("express"));
const passwordReset = express_1.default.Router();
passwordReset.post("/otp", passwordResetController_1.default);
passwordReset.post("/verification", OTPVerificationController_1.default);
exports.default = passwordReset;
