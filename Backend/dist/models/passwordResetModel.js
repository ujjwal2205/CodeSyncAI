"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const passwordReset = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    resetOTP: { type: String, required: true },
    resetOTPExpiry: { type: Date, expires: 600 }
});
const passwordResetModel = mongoose_1.default.models.password || mongoose_1.default.model("password", passwordReset);
exports.default = passwordResetModel;
