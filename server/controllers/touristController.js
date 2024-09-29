import tourist from "../models/touristSchema.js";

export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, job, wallet } = req.body; 

    try {
        const newTourist = await tourist.create({ email, username, password, mobile, dob, nationality, job, wallet });
        res.status(200).json(newTourist);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

