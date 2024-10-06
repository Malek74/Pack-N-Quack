
import touristGoverner from '../models/touristGovernorScehma.js';
import { usernameExists } from './Helpers.js';


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
        const newTouristGovernor = await touristGoverner.create({ username, password, });
        console.log(newTouristGovernor)
        return res.status(201).json(newTouristGovernor);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

export const getTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await touristGoverner.find({});
        res.status(200).json(touristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateTouristGovernor = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username, and password are required." });
    }

    try {
        const updatedTouristGovernor = await touristGoverner.findOneAndUpdate({}, { username, password }, { new: true });
        res.status(200).json(updatedTouristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteTouristGovernor = async (req, res) => {
    try {
        await touristGoverner.findOneAndDelete({});
        res.status(200).json({ message: "Tourist Governor deleted successfully" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
