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
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = exports.io = void 0;
const userManager_1 = require("../managers/userManager");
const codeManager_1 = require("../managers/codeManager");
const roomManager_1 = require("../managers/roomManager");
const initSocket = (socketServer) => {
    exports.io = socketServer;
    exports.io.on("connection", (socket) => {
        console.log("Connected:", socket.id);
        socket.on("joinRoom", (_a) => __awaiter(void 0, [_a], void 0, function* ({ roomId, userName, isOwner, userId }) {
            socket.join(roomId);
            (0, userManager_1.addUser)(socket.id, roomId, userName, userId);
            (0, roomManager_1.addToRoom)(socket.id, roomId);
            if (isOwner) {
                (0, roomManager_1.setRoomOwner)(roomId, socket.id);
            }
            exports.io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
            const code = yield (0, codeManager_1.getCode)(roomId);
            if (code) {
                socket.emit("codeUpdate", code);
            }
        }));
        socket.on("codeChange", ({ roomId, code }) => {
            const allowed = (0, roomManager_1.acquireEditorLock)(roomId, socket.id);
            if (!allowed) {
                socket.emit("editorLocked", "Another user is typing");
                return;
            }
            (0, codeManager_1.setCode)(roomId, code);
            socket.to(roomId).emit("codeUpdate", code);
        });
        socket.on("languageChange", ({ roomId, language }) => {
            socket.to(roomId).emit("languageUpdate", language);
        });
        socket.on("typing", ({ roomId, userName }) => {
            socket.to(roomId).emit("userTyping", { userName });
        });
        socket.on("stopTyping", ({ roomId, userName }) => {
            (0, roomManager_1.releaseEditorLock)(roomId, socket.id);
            socket.to(roomId).emit("userStoppedTyping", { userName });
        });
        socket.on("cursorMove", ({ roomId, position, userName }) => {
            socket.to(roomId).emit("cursorUpdate", {
                position,
                userName
            });
        });
        socket.on("runCode", ({ roomId, output }) => {
            socket.to(roomId).emit("runCodeUpdate", (output));
        });
        socket.on("customInput", ({ roomId, input }) => {
            socket.to(roomId).emit("customInputChange", (input));
        });
        socket.on("kick", ({ roomId, userId }) => {
            const targetSocketId = (0, userManager_1.getSocketIdByUserId)(userId);
            if (!targetSocketId)
                return;
            exports.io.to(targetSocketId).emit("kicked");
            const targetSocket = exports.io.sockets.sockets.get(targetSocketId);
            if (targetSocket) {
                targetSocket.leave(roomId);
            }
            (0, userManager_1.removeUser)(targetSocketId);
            (0, roomManager_1.removeFromRoom)(targetSocketId, roomId);
            exports.io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
        });
        socket.on("sendGroupMessage", ({ roomId, message }) => {
            const user = (0, userManager_1.getUser)(socket.id);
            if (!user)
                return;
            socket.to(roomId).emit("receiveGroupMessage", { message, senderId: { userName: user.userName } });
        });
        socket.on("disconnect", () => {
            const roomId = (0, userManager_1.getUserRoom)(socket.id);
            if (roomId) {
                const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
                if (ownerId === socket.id) {
                    exports.io.to(roomId).emit("roomClosed");
                    (0, codeManager_1.deleteCode)(roomId);
                    (0, roomManager_1.closeRoom)(roomId);
                    console.log("User Disconnected:-", socket.id);
                    return;
                }
                (0, userManager_1.removeUser)(socket.id);
                (0, roomManager_1.removeFromRoom)(socket.id, roomId);
                if (!(0, roomManager_1.roomExists)(roomId)) {
                    (0, codeManager_1.deleteCode)(roomId);
                }
                else {
                    exports.io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
                }
            }
            exports.io.emit("onlineUsers", (0, userManager_1.getAllOnlineUsers)());
            console.log("User Disconnected:-", socket.id);
        });
    });
};
exports.initSocket = initSocket;
