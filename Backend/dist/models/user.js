"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: {
        type: String,
        required: function () {
            return this.authType == 'local';
        }
    },
    googleId: { type: String },
    authType: { type: String, required: true },
}, { timestamps: true });
const userModel = mongoose_1.default.models.user || mongoose_1.default.model("user", userSchema);
exports.default = userModel;
