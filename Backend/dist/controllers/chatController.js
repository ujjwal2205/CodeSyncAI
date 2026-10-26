"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.addMessagesAI = exports.addMessagesGroup = exports.getMessages = void 0;
const chatModel_1 = __importDefault(require("../models/chatModel"));
const room_1 = __importDefault(require("../models/room"));
const user_1 = __importDefault(require("../models/user"));
const gemini_1 = require("../services/gemini");
const socket_1 = require("../socket/socket");
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, type } = req.body;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        const messages = yield chatModel_1.default.find({ roomId, type }).populate("senderId", "userName").sort({ createdAt: 1 });
        return res.json({ success: true, messages });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.getMessages = getMessages;
const addMessagesGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, message } = req.body;
    const { userId } = req.user;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        if (!(message === null || message === void 0 ? void 0 : message.trim())) {
            return res.json({ success: false, message: "Message is required" });
        }
        yield chatModel_1.default.create({
            roomId,
            type: "group",
            role: "user",
            senderId: userId,
            message
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.addMessagesGroup = addMessagesGroup;
const addMessagesAI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, message } = req.body;
    const { userId } = req.user;
    try {
        const room = yield room_1.default.findOne({ roomId });
        const user = yield user_1.default.findById(userId);
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        if (!(message === null || message === void 0 ? void 0 : message.trim())) {
            return res.json({ success: false, message: "Message is required" });
        }
        const newMessage = {
            roomId,
            type: "ai",
            role: "user",
            senderId: userId,
            message
        };
        console.log("roomId");
        socket_1.io.to(roomId).emit("receiveUserMessage", { message, role: "user", senderId: { userName: user.userName } });
        yield chatModel_1.default.create(newMessage);
        const aiReply = yield (0, gemini_1.askGemini)(message);
        yield chatModel_1.default.create({
            roomId,
            type: "ai",
            role: "assistant",
            message: aiReply
        });
        socket_1.io.to(roomId).emit("receiveAiMessage", { message: aiReply, role: "ai" });
        return res.json({ success: true, aiReply });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.addMessagesAI = addMessagesAI;
const deleteChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (room) {
            return res.json({ success: false, message: "Room still exists" });
        }
        yield chatModel_1.default.deleteMany({ roomId });
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.deleteChats = deleteChats;
