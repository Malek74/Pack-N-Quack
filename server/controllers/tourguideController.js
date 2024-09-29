import tourGuide from "../models/tourGuideSchema.js";

export const createTourGuide = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        const newTourGuide = await tourGuide.create({ email, username, password});
        res.status(200).json(newTourGuide);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

