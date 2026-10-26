"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatController_1 = require("../controllers/chatController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const express_1 = __importDefault(require("express"));
const chatRoute = express_1.default.Router();
chatRoute.post("/get-messages", authMiddleware_1.default, chatController_1.getMessages);
chatRoute.post("/addMessagesAI", authMiddleware_1.default, chatController_1.addMessagesAI);
chatRoute.post("/addMessagesGroup", authMiddleware_1.default, chatController_1.addMessagesGroup);
chatRoute.post("/deleteChats", authMiddleware_1.default, chatController_1.deleteChats);
exports.default = chatRoute;
