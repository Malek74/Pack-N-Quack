import mongoose from "mongoose";
import { PasswordChangeRequest } from "../models/changePassSchema.js";
import { checkUserExists } from "../utils/Helpers.js";

export const requestPasswordChange = async (req, res) => {
    const { userId, requestedPassword, userType } = req.body; // Make sure to extract userType
    
    try {
        // Check if the user exists
        const userExists = await checkUserExists(userId, userType);
        if (!userExists) {
            return res.status(404).json({ message: "User not found." });
        }
        if (PasswordChangeRequest.status!='pending'){
            PasswordChangeRequest.status='pending';

        }
        // Create the password change request
        const changeRequest = new PasswordChangeRequest({
            userId,
            requestedPassword,
            userType,
        });
        await changeRequest.save();

        return res.status(200).json({ message: "Request to change password is pending" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};