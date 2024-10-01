import TouristGovernor from '../models/touristGovernor';

export const createTouristGovernor = async (req, res) => {
    const { username, password } = req.body;


    const touristGovernorExists = await TouristGovernor.find({});

    //todo: check if user already exists
    // const userameExists = await

    if (touristGovernorExists) {
        return res.status(400).json({ message: "Tourist Governor already exists" });
    }

    if (!username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required." });
    }

    try {
        const newTouristGovernor = await TouristGovernor.create({ email, username, password, mobile });
        res.status(201).json(newTouristGovernor);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}
