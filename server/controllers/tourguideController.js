import tourGuide from "../models/tourGuideSchema.js";

export const createTourGuide = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        // Check if the email is already taken
        const existingtourGuide = await tourGuide.findOne({ email });

        if (existingtourGuide) {
            return res.status(400).json({ message: "Email already taken." });
        }
        const newTourGuide = await tourGuide.create({ email, username, password});
        res.status(200).json(newTourGuide);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

