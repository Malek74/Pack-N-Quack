
import touristGoverner from '../models/touristGovernorScehma.js';
import { usernameExists } from '../utils/Helpers.js';
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";


export const createTouristGovernor = async (req, res) => {
    const { username, password } = req.body;
    //check if all required fields are present
    if (!username || !password) {
        return res.status(400).json({ message: "Username, and password are required." });
    }

    const userExists = await usernameExists(username);
    //check that username is unique across all users
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    try {
        //hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTouristGovernor = await touristGoverner.create({ username, password: hashedPassword });
        console.log(newTouristGovernor)
        return res.status(201).json(newTouristGovernor);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

export const getTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await touristGoverner.findById(req.user._id);
        console.log(touristGovernor)
        res.status(200).json(touristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getAllTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await touristGoverner.findById(req.user._id);
        console.log(touristGovernor)
        res.status(200).json(touristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateTouristGovernor = async (req, res) => {
    const { username, password } = req.body;
    const id = req.user._id;

    if (!username || !password) {
        return res.status(400).json({ message: "Username, and password are required." });
    }

    try {
        //hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const updatedTouristGovernor = await touristGoverner.findByIdAndUpdate(id, { username, password: hashedPassword }, { new: true });
        res.status(200).json(updatedTouristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteTouristGovernor = async (req, res) => {
    const name = req.body.username;

    try {
        await touristGoverner.findOneAndDelete({ username: name });
        res.status(200).json({ message: "Tourist Governor deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
