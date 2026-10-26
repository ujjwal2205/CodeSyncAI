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
exports.leaveRoomController = exports.kickController = void 0;
const room_1 = __importDefault(require("../models/room"));
const room_2 = __importDefault(require("../models/room"));
const leaveRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    const { userId } = req.user;
    try {
        const room = yield room_1.default.findOne({ roomId: roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        if (room.createdBy.toString() === userId) {
            yield room.deleteOne();
            return res.json({ success: true, message: "Room deleted successfully" });
        }
        else {
            room.participants = room.participants.filter((participant) => participant.toString() !== userId);
        }
        yield room.save();
        return res.json({ success: true, message: "Left the room successfully" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.leaveRoomController = leaveRoomController;
const kickController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId, userId } = req.body;
        const room = yield room_2.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        console.log(userId);
        const exists = room.participants.some((id) => id.toString() === userId);
        if (!exists) {
            return res.json({ success: false, message: "User doesn't exist in the room" });
        }
        room.participants = room.participants.filter((id) => id.toString() !== userId);
        room.save();
        return res.json({ success: true, message: "User removed successfully!" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.kickController = kickController;
