import mongoose from "mongoose";
import { PasswordChangeRequest } from "../models/changePassSchema.js";
import { checkUserExists } from "../utils/Helpers.js";
import bcrypt from "bcrypt";

export const requestPasswordChange = async (req, res) => {
    const { requestedPassword, oldPassword, userType } = req.body; // Make sure to extract userType
    console.log(req.body);
    const userId = req.user._id;

    if (!requestedPassword || !oldPassword || !userType) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Check if the user exists
        const userExists = await checkUserExists(userId, userType);

        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }

        const isdiff = await bcrypt.compare(requestedPassword, userExists.password);
        console.log(isdiff);

        // check if requested password is matches current password
        if (isdiff) {
            return res.status(400).json({ message: "New password cannot be the same as old password." });
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(requestedPassword, salt);

        //update password for user
        userExists.password = hashedPassword;
        await userExists.save();

        return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};