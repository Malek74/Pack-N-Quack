import mongoose from "mongoose";
import { PasswordChangeRequest } from "../models/changePassSchema.js";
import { checkUserExists } from "../utils/Helpers.js";

export const requestPasswordChange = async (req, res) => {
    const { requestedPassword, oldPassword, userType } = req.body; // Make sure to extract userType
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
        // check if requested password is matches current password
        if (userExists.password === requestedPassword) {
            return res.status(400).json({ message: "New password cannot be the same as the current password." });
        }

        //check if old password matches current password
        if (userExists.password !== oldPassword) {
            return res.status(400).json({ message: "Old password is incorrect." });
        }

        //change password
        userExists.password = requestedPassword;
        await userExists.save();

        return res.status(200).json({ message: "Password Changed Successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};