import adminModel from "../models/adminSchema.js";
import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { getUserRole, createToken } from "../utils/Helpers.js";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpModel from "../models/otpSchema.js";
import nodemailer from "nodemailer";
import { io } from '../server.js';
config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // Or 587 for other providers
    secure: true, // true for 465, false for 587
    auth: {
        user: 'captianquackerss@gmail.com', // organization's email
        pass: process.env.EMAIL_PASSKEY, // your email password
    },
});
const shareMail = async (email, otpCode, username) => {

    try {
        const mailOptions = {
            from: '"CaptainQuackers" <captianquackerss@gmail.com>',
            to: email,
            subject: `Your OTP for Pack N Quack Verification`,
            text: `Hello ${username}, here is your OTP for account verification: ${otpCode}. It is valid for the next 10 minutes.`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #0D47A1;">Your One-Time Password (OTP)</h1>
                <p>Hello,</p>
                <p>Thank you for using Pack N Quack. To complete your account verification or reset your password, please use the following OTP:</p>
                <div style="background-color: #F4F4F4; padding: 20px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    <h2 style="margin: 0; font-size: 24px; color: #0D47A1;">${otpCode}</h2>
                </div>
                <p>This OTP is valid for the next <strong>10 minutes</strong>. Please do not share this OTP with anyone for security reasons.</p>
                <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
                <p>Best regards,<br>Captain Quackers and the Pack N Quack Team</p>
                <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px;height:auto; margin-top: 20px;" />
            </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: '../client/public/assets/icons/logo.png',
                    cid: 'logo',
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error(error);
    }
};



export const login = async (req, res) => {
    const { username, password } = req.body;
    const role = await getUserRole(username);
    let user;
    if (!username || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (!role) {
        return res.status(400).json({ message: "Username not found" });
    }

    switch (role) {
        case "Admin":
            user = await adminModel.findOne({ username: username });
            break;

        case "Advertiser":
            user = await Advertiser.findOne({ username: username });
            break;

        case "Seller":
            user = await Seller.findOne({ username: username });
            break;

        case "Tourist":
            user = await Tourist.findOne({ username: username });
            break;

        case "Tour Guide":
            user = await TourGuide.findOne({ username: username });
            break;

        case "Tourism Governer":
            user = await TouristGovernor.findOne({ username: username });
            break;

        default:
            user = null;
            break;
    }

    if (!user) {
        return res.status(400).json({ message: "Username not found" });
    }

    // check if password is correct
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
        return res.status(400).json({ error: 'Incorrect password' });
    }

    // create token
    console.log(user._id);
    const token = createToken(user.username, user._id, role, '');


    //create cookie
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
        sameSite: 'none',
    })

    return res.status(200).json({ role: role, username: user.username, id: user._id });


}

export const logout = (req, res) => {
    //clear the cookie
    res.cookie('jwt', '', {
        httpOnly: true,
        path: '/'
    });
    return res.status(200).json({ message: "Logout successful" });
}

export const forgotPassword = async (req, res) => {
    const id = req.user._id;
    const username = req.user.username;
    let user;

    switch (req.role) {
        case "Admin":
            user = await adminModel.findOne({ username: username });
            break;

        case "Advertiser":
            user = await Advertiser.findOne({ username: username });
            break;

        case "Seller":
            user = await Seller.findOne({ username: username });
            break;

        case "Tourist":
            user = await Tourist.findOne({ username: username });
            break;

        case "Tour Guide":
            user = await TourGuide.findOne({ username: username });
            break;

        case "Tourism Governer":
            user = await TouristGovernor.findOne({ username: username });
            break;

        default:
            user = null;
            break;
    }

    if (!user) {
        return res.status(400).json({ message: "Username not found" });
    }

    let otpCode;
    //check if user has any pending otp request
    const otp = await otpModel.findOne({ userId: id, status: 'pending' });

    //if user has a pending otp request, return the otp
    if (!otp) {
        //generate otp of 6 digits
        const code = Math.floor(100000 + Math.random() * 900000);

        //create otp request
        const newOtp = await otpModel.create({ otp: code, userId: id });
        console.log(newOtp);
        otpCode = newOtp.otp;
    } else {
        otpCode = otp.otp;
    }

    //send otp to user via email 

    console.log(user);
    await shareMail(user.email, otpCode, user.username);

    return res.status(200).json({ message: "OTP sent successfully" });
}

export const updatePassword = async (req, res) => {
    const id = req.user._id;
    const { otp, newPassword } = req.body;

    //check otp code is correct
    const code = await otpModel.findOne({ userId: id, otp: otp, status: 'pending' });
    console.log(code);
    if (!code) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    //check if new password is different from old password

    //print old password

    const isdiff = await bcrypt.compare(newPassword, req.user.password);
    if (isdiff) {
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
    }

    //hash new password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    let user;

    //update password
    switch (req.role) {
        case "Admin":
            user = await adminModel.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        case "Advertiser":
            user = await Advertiser.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        case "Seller":
            user = await Seller.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        case "Tourist":
            user = await Tourist.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        case "Tour Guide":
            user = await TourGuide.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        case "Tourism Governer":
            user = await TouristGovernor.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
            break;

        default:
            user = null;
            break;
    }

    //delete otp
    await otpModel.findByIdAndDelete(code._id);

    return res.status(200).json(user);

}
