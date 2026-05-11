"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRoom = exports.getRoomSetting = exports.setRoomSettings = exports.getRoomOwner = exports.setRoomOwner = exports.roomExists = exports.getRoomUsers = exports.removeFromRoom = exports.addToRoom = void 0;
const userManager_1 = require("./userManager");
const rooms = new Map();
const roomOwners = new Map();
const roomSettings = new Map();
const addToRoom = (socketId, roomId) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socketId);
};
exports.addToRoom = addToRoom;
const removeFromRoom = (socketId, roomId) => {
    const room = rooms.get(roomId);
    if (!room) {
        return;
    }
    room.delete(socketId);
    if (room.size === 0) {
        rooms.delete(roomId);
    }
};
exports.removeFromRoom = removeFromRoom;
const getRoomUsers = (roomId) => {
    const roomUsers = Array.from(rooms.get(roomId) || []);
    return roomUsers.map((socketId) => {
        const user = (0, userManager_1.getUser)(socketId);
        return {
            socketId,
            userName: (user === null || user === void 0 ? void 0 : user.userName) || "Anonymous"
        };
    });
};
exports.getRoomUsers = getRoomUsers;
const roomExists = (roomId) => {
    return rooms.has(roomId);
};
exports.roomExists = roomExists;
const setRoomOwner = (roomId, socketId) => {
    if (!roomOwners.has(roomId)) {
        roomOwners.set(roomId, socketId);
    }
};
exports.setRoomOwner = setRoomOwner;
const getRoomOwner = (roomId) => {
    if (!roomOwners.has(roomId)) {
        return;
    }
    return roomOwners.get(roomId);
};
exports.getRoomOwner = getRoomOwner;
const setRoomSettings = (roomId, requireApproval) => {
    roomSettings.set(roomId, { requireApproval });
};
exports.setRoomSettings = setRoomSettings;
const getRoomSetting = (roomId) => {
    return roomSettings.get(roomId);
};
exports.getRoomSetting = getRoomSetting;
const closeRoom = (roomId) => {
    rooms.delete(roomId);
    roomOwners.delete(roomId);
    roomSettings.delete(roomId);
};
exports.closeRoom = closeRoom;
