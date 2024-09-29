import seller from "../models/sellerSchema.js";

export const createSeller = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        const newseller = await seller.create({ email, username, password});
        res.status(200).json(newseller);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

