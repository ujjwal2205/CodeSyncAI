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
const room_1 = __importDefault(require("../models/room"));
const joinRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    const { userId } = req.user;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        if (room.participants.length >= room.maxCapacity) {
            return res.json({ success: false, message: "Room is full" });
        }
        room.participants.push(userId);
        room.save();
        return res.json({ success: true, message: "Joined room successfully" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.default = joinRoomController;
