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
exports.fetchUserDetails = exports.googleLogin = exports.logOut = exports.logIn = exports.signUp = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const validator_1 = __importDefault(require("validator"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const googleAuth_1 = __importDefault(require("../middleware/googleAuth"));
const createToken = (user) => {
    return jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
//SignUp
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password, confirmPassword } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        const normalizedUserName = userName.toLowerCase();
        const exists = yield user_1.default.findOne({ email: normalizedEmail });
        const exists2 = yield user_1.default.findOne({ userName: normalizedUserName });
        if (exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        if (exists2) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }
        if (!validator_1.default.isEmail(normalizedEmail)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = yield user_1.default.create({
            userName: normalizedUserName,
            email: normalizedEmail,
            password: hashedPassword,
            authType: "local"
        });
        const token = createToken(newUser);
        res.cookie("token", token, {
            httpOnly: true, //JS cookie ko access nhi kar skta
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", //lax:same site se request par hi cookie available hoga, none: kisi bhi site se request par cookie available hoga(ye tab use karte hai jab frontend and backend dono alag domain par ho), strict: same site se hi request par cookie available hoga(ismein agar user kisi dusre site se aata hai to cookie available nhi hoga(e.g google se website search karke aata hai.))
            secure: process.env.NODE_ENV === "production", //https(secure:true) mein hi cookie set hoga
            maxAge: 7 * 24 * 60 * 60 * 1000 //milisecond mein 7 days 
        });
        res.status(201).json({ success: true, message: "Login Successful!", token });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.signUp = signUp;
//Log In
const logIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email.toLowerCase();
        const user = yield user_1.default.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        if (user.authType !== "local") {
            return res.status(400).json({ success: false, message: `Please log in with ${user.authType}` });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password); //bcrypt hashedPassword se salt or cost leke user.password ko usmein convert karta hai fir compare karta hai.
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const token = createToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, message: "Login Successful!", token });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.logIn = logIn;
//Log Out
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            secure: process.env.NODE_ENV === "production"
        });
        return res.json({ success: true, message: "Logged Out Successfully!" });
    }
    catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
});
exports.logOut = logOut;
//googleLogin
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idToken } = req.body;
        const googleUser = yield (0, googleAuth_1.default)(idToken);
        const { email, given_name } = googleUser;
        const normalizedEmail = email === null || email === void 0 ? void 0 : email.toLowerCase();
        let user = yield user_1.default.findOne({ email: normalizedEmail });
        if (user && user.authType !== "google") {
            return res.status(400).json({ success: false, message: `Please log in with ${user.authType}` });
        }
        if (!user) {
            let normalizedUserName = (given_name === null || given_name === void 0 ? void 0 : given_name.toLowerCase().trim()) || (normalizedEmail === null || normalizedEmail === void 0 ? void 0 : normalizedEmail.split("@")[0]);
            let count = 1;
            while (yield user_1.default.findOne({ userName: normalizedUserName })) {
                normalizedUserName = `${normalizedUserName}${count}`;
                count++;
            }
            user = new user_1.default({
                userName: normalizedUserName,
                email: normalizedEmail,
                authType: "google"
            });
            yield user.save();
        }
        const token = createToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, message: "Login Successful!", token });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.googleLogin = googleLogin;
// fetch user details
const fetchUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.user;
        const user = yield user_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(200).json({ success: true, userName: user.userName, email: user.email, userId: user._id });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.fetchUserDetails = fetchUserDetails;
