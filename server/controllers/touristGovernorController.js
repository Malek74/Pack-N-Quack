import touristGoverner from '../models/touristGovernorScehma.js';
import { usernameExists } from './Helpers.js';


export const createTouristGovernor = async (req, res) => {
    const { username, password } = req.body;

    const touristGovernorExists = await touristGoverner.findOne({});



    //check that tourist governor does not exist
    if (touristGovernorExists) {
        return res.status(400).json({ message: "Tourist Governor already exists" });
    }

    //check if all required fields are present
    if (!username || !password) {
        return res.status(400).json({ message: "Username, and password are required." });
    }

    const userExists = await usernameExists(username);
    //check that username is unique across all users
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    console.log("Creating tourist governor");

    try {
        const newTouristGovernor = await touristGoverner.create({ username, password, });
        res.status(201).json(newTouristGovernor);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getTouristGovernor = async (req, res) => {
    try {
        const touristGovernor = await touristGoverner.findOne({});
        res.status(200).json(touristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
