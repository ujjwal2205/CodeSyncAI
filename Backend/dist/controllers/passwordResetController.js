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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const passwordResetModel_1 = __importDefault(require("../models/passwordResetModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const passwordResetController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        let exist = yield user_1.default.findOne({ email: normalizedEmail });
        if (!exist) {
            return res.json({ success: false, message: "User doesn't exist!" });
        }
        if (exist.authType !== "local") {
            return res.json({ success: false, message: `Please log in with ${exist.authType}` });
        }
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        const newUser = new passwordResetModel_1.default({
            email: normalizedEmail,
            resetOTP: otp,
            resetOTPExpiry: new Date()
        });
        yield newUser.save();
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
        yield transporter.sendMail({
            to: email,
            subject: "CodeSyncAI Password Reset OTP",
            html: `<p>Your OTP for password reset is <b>${otp}</b>. It is valid for 10 minutes.</p>`,
        });
        return res.json({ success: true, message: "OTP sent to your email!" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.default = passwordResetController;
