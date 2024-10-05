import admin from "../models/AdminSchema.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await admin.find({});
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}