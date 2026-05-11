"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const userManager_1 = require("../managers/userManager");
const codeManager_1 = require("../managers/codeManager");
const roomManager_1 = require("../managers/roomManager");
const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("New user connected:", socket.id);
        socket.on("createRoom", ({ roomId, userName, requireApproval }) => {
            socket.join(roomId);
            (0, roomManager_1.setRoomOwner)(roomId, socket.id);
            (0, roomManager_1.setRoomSettings)(roomId, requireApproval);
            (0, userManager_1.addUser)(socket.id, roomId, userName);
            (0, roomManager_1.addToRoom)(socket.id, roomId);
            socket.emit("roomCreated", { roomId });
        });
        socket.on("requestJoin", ({ roomId, userName }) => {
            const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
            const ownerSocket = io.sockets.sockets.get(ownerId);
            const setting = (0, roomManager_1.getRoomSetting)(roomId);
            if (!ownerId) {
                socket.emit("roomNotExists", "No Room Exist with this roomId");
                return;
            }
            if (!(setting === null || setting === void 0 ? void 0 : setting.requireApproval)) {
                (0, userManager_1.addUser)(socket.id, roomId, userName);
                socket.join(roomId);
                (0, roomManager_1.addToRoom)(socket.id, roomId);
                const code = (0, codeManager_1.getCode)(roomId);
                if (code) {
                    socket.emit("codeUpdate", code);
                }
                io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
                io.emit("onlineUsers", (0, userManager_1.getAllOnlineUsers)());
                socket.emit("joinApproved", { roomId });
                console.log(`User ${socket.id} joined room ${roomId}`);
                return;
            }
            io.to(ownerId).emit("joinRequest", {
                socketId: socket.id,
                userName,
                roomId
            });
            socket.emit("waitingForApproval");
        });
        socket.on("approveJoin", ({ socketId, roomId, userName }) => {
            const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
            if (socket.id !== ownerId)
                return;
            const targetSocket = io.sockets.sockets.get(socketId);
            if (!targetSocket) {
                return;
            }
            targetSocket.join(roomId);
            (0, userManager_1.addUser)(socketId, roomId, userName);
            (0, roomManager_1.addToRoom)(socketId, roomId);
            targetSocket.emit("joinApproved", { roomId });
            io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
        });
        socket.on("rejectJoin", ({ socketId, roomId }) => {
            const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
            if (socket.id !== ownerId)
                return;
            const targetSocket = io.sockets.sockets.get(socketId);
            targetSocket === null || targetSocket === void 0 ? void 0 : targetSocket.emit("joinRejected");
        });
        socket.on("toggleApproval", ({ roomId, requireApproval }) => {
            const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
            if (socket.id !== ownerId) {
                return;
            }
            (0, roomManager_1.setRoomSettings)(roomId, requireApproval);
            io.to(roomId).emit("approvalModeChanged", { requireApproval });
        });
        socket.on("codeChange", ({ roomId, code }) => {
            (0, codeManager_1.setCode)(roomId, code);
            socket.to(roomId).emit("codeUpdate", code);
        });
        socket.on("typing", ({ roomId, userName }) => {
            socket.to(roomId).emit("userTyping", { userName });
        });
        socket.on("stopTyping", ({ roomId, userName }) => {
            socket.to(roomId).emit("userStoppedTyping", { userName });
        });
        socket.on("cursorMove", ({ roomId, position, userName }) => {
            socket.to(roomId).emit("cursorUpdate", {
                position,
                userName
            });
        });
        socket.on("disconnect", () => {
            const roomId = (0, userManager_1.getUserRoom)(socket.id);
            if (roomId) {
                const ownerId = (0, roomManager_1.getRoomOwner)(roomId);
                if (ownerId === socket.id) {
                    (0, codeManager_1.deleteCode)(roomId);
                    (0, roomManager_1.closeRoom)(roomId);
                    io.to(roomId).emit("roomClosed");
                    return;
                }
                (0, roomManager_1.removeFromRoom)(socket.id, roomId);
                if (!(0, roomManager_1.roomExists)(roomId)) {
                    (0, codeManager_1.deleteCode)(roomId);
                }
                else {
                    io.to(roomId).emit("roomUsers", (0, roomManager_1.getRoomUsers)(roomId));
                }
            }
            (0, userManager_1.removeUser)(socket.id);
            io.emit("onlineUsers", (0, userManager_1.getAllOnlineUsers)());
            console.log("User Disconnected:-", socket.id);
        });
    });
};
exports.initSocket = initSocket;
