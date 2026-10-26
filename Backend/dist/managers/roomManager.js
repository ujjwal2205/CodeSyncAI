"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.releaseEditorLock = exports.acquireEditorLock = exports.closeRoom = exports.getRoomOwner = exports.setRoomOwner = exports.roomExists = exports.getRoomUsers = exports.removeFromRoom = exports.addToRoom = void 0;
const userManager_1 = require("./userManager");
const rooms = new Map();
const roomOwners = new Map();
const roomEditorLock = new Map();
const addToRoom = (socketId, roomId) => {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(socketId);
    console.log(rooms);
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
    console.log(rooms);
};
exports.removeFromRoom = removeFromRoom;
const getRoomUsers = (roomId) => {
    const roomUsers = Array.from(rooms.get(roomId) || []);
    return roomUsers.map((socketId) => {
        var _a;
        const user = (0, userManager_1.getUser)(socketId);
        const ownerSocket = roomOwners.get(roomId);
        return {
            socketId,
            userName: (_a = user === null || user === void 0 ? void 0 : user.userName) !== null && _a !== void 0 ? _a : "",
            isOwner: socketId === ownerSocket,
            _id: user === null || user === void 0 ? void 0 : user.userId
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
const closeRoom = (roomId) => {
    rooms.delete(roomId);
    roomOwners.delete(roomId);
};
exports.closeRoom = closeRoom;
const acquireEditorLock = (roomId, socketId) => {
    const currentUser = roomEditorLock.get(roomId);
    if (currentUser && currentUser !== socketId) {
        return false;
    }
    roomEditorLock.set(roomId, socketId);
    return true;
};
exports.acquireEditorLock = acquireEditorLock;
const releaseEditorLock = (roomId, socketId) => {
    if (roomEditorLock.get(roomId) === socketId) {
        roomEditorLock.delete(roomId);
    }
};
exports.releaseEditorLock = releaseEditorLock;
