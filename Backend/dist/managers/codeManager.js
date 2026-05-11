"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCode = exports.getCode = exports.setCode = void 0;
const roomCode = new Map();
const setCode = (roomId, code) => {
    roomCode.set(roomId, code);
};
exports.setCode = setCode;
const getCode = (roomId) => {
    return roomCode.get(roomId);
};
exports.getCode = getCode;
const deleteCode = (roomId) => {
    roomCode.delete(roomId);
};
exports.deleteCode = deleteCode;
