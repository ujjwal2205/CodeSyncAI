"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const roomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "user", required: true },
    maxCapacity: { type: Number, required: true },
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "user" }]
}, { timestamps: true });
const roomModel = mongoose_1.default.models.room || mongoose_1.default.model("room", roomSchema);
exports.default = roomModel;
