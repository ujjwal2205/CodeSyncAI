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
const codeManager_1 = require("../managers/codeManager");
function generateRoomId() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let roomId = "";
    for (let i = 0; i < 3; i++) {
        roomId += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 3; i++) {
        roomId += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return roomId;
}
const createRoomController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { maxCapacity } = req.body;
    const { userId } = req.user;
    try {
        let roomId = generateRoomId();
        while (yield room_1.default.findOne({ roomId })) {
            roomId = generateRoomId();
        }
        (0, codeManager_1.setCode)(roomId, "// Start Typing...");
        const newRoom = yield room_1.default.create({
            roomId,
            code: "// Start coding...",
            language: "javascript",
            createdBy: userId,
            maxCapacity: maxCapacity,
            participants: [userId]
        });
        return res.json({ success: true, roomId: newRoom.roomId });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.default = createRoomController;
