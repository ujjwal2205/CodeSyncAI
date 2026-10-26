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
const passwordResetModel_1 = __importDefault(require("../models/passwordResetModel"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const OTPVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        let user = yield passwordResetModel_1.default.findOne({ email: normalizedEmail });
        let info = yield user_1.default.findOne({ email: normalizedEmail });
        if (!user) {
            return res.json({ success: false, message: "OTP Expired" });
        }
        if (user.resetOTP != otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, salt);
        info.password = hashedPassword;
        yield info.save();
        return res.json({ success: true, message: "Password Changed Successfully!" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.default = OTPVerificationController;
