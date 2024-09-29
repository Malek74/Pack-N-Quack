import touristGovernor from "../models/touristGovernor.js";

export const createTouristGovernor = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        const newtouristGovernor = await touristGovernor.create({ email, username, password});
        res.status(200).json(newtouristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

