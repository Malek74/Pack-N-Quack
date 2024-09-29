import advertisor from "../models/advertiserSchema.js";

export const createAdvertisor = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        const newadvertisor = await advertisor.create({ email, username, password});
        res.status(200).json(newadvertisor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

