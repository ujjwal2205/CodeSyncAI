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
exports.languageChangeController = exports.getLanguage = void 0;
const room_1 = __importDefault(require("../models/room"));
const languageChangeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, language } = req.body;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        room.language = language;
        room.code = "// Start Typing...";
        yield room.save();
        return res.json({ success: true });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.languageChangeController = languageChangeController;
const getLanguage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId } = req.body;
    try {
        const room = yield room_1.default.findOne({ roomId });
        if (!room) {
            return res.json({ success: false, message: "Room not found" });
        }
        return res.json({ success: true, language: room.language });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.getLanguage = getLanguage;
