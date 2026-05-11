"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUserRoom = exports.getAllOnlineUsers = exports.removeUser = exports.addUser = void 0;
const onlineUsers = new Map();
const addUser = (socketId, roomId, userName) => {
    onlineUsers.set(socketId, { userName, roomId });
};
exports.addUser = addUser;
const removeUser = (socketId) => {
    onlineUsers.delete(socketId);
};
exports.removeUser = removeUser;
const getAllOnlineUsers = () => {
    return Array.from(onlineUsers.entries()).map(([id, user]) => ({
        socketId: id,
        userName: user.userName
    }));
};
exports.getAllOnlineUsers = getAllOnlineUsers;
const getUserRoom = (socketId) => {
    var _a;
    return (_a = onlineUsers.get(socketId)) === null || _a === void 0 ? void 0 : _a.roomId;
};
exports.getUserRoom = getUserRoom;
const getUser = (socketId) => {
    return onlineUsers.get(socketId);
};
exports.getUser = getUser;
