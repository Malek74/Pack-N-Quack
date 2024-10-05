import admin from "../models/AdminSchema.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await admin.find({});
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const addAdmin = async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await admin.findOne({ username });
    if (adminExists) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new admin({ username, password });
    try {
        const a = await newAdmin.save();
        res.status(200).json(a);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}