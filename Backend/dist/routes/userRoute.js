"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userController_1 = require("../controllers/userController");
const userRouter = express_1.default.Router();
userRouter.post("/signup", userController_1.signUp);
userRouter.post("/login", userController_1.logIn);
userRouter.post("/logout", userController_1.logOut);
userRouter.post("/googleLogin", userController_1.googleLogin);
userRouter.get("/details", authMiddleware_1.default, userController_1.fetchUserDetails);
exports.default = userRouter;
