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
exports.deleteCode = exports.getCode = exports.setCode = void 0;
const redis_1 = require("../redis");
const setCode = (roomId, code) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redis.set(roomId, code);
});
exports.setCode = setCode;
const getCode = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield redis_1.redis.get(roomId);
});
exports.getCode = getCode;
const deleteCode = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_1.redis.del(roomId);
});
exports.deleteCode = deleteCode;
