"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket/socket");
const db_1 = require("./config/db");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const passwordResetRoute_1 = __importDefault(require("./routes/passwordResetRoute"));
const roomRoute_1 = __importDefault(require("./routes/roomRoute"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, db_1.connectDB)();
const port = 4000;
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000",
    "https://codesyncai-frontend.onrender.com"
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/api/user", userRoute_1.default);
app.use("/api/forgot-password", passwordResetRoute_1.default);
app.use("/api/room", roomRoute_1.default);
app.use("/api/chat", chatRoute_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true
    }
});
(0, socket_1.initSocket)(io);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
