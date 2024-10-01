import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";

export const createAdvertisor = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        // Check if the email or username is already taken by any user
        const isEmailOrUsernameTaken = await Promise.all([
            Tourist.findOne({ $or: [{ email }, { username }] }),
            TourGuide.findOne({ $or: [{ email }, { username }] }),
            TouristGovernor.findOne({ username }),
            Seller.findOne({ $or: [{ email }, { username }] }),
            Admin.findOne( { username }),
            Advertiser.findOne({ $or: [{ email }, { username }] }),
        ]);

        if (isEmailOrUsernameTaken.some(user => user)) {
            return res.status(400).json({ message: "Email or username already taken." });
        }

        const newadvertisor = await Advertiser.create({ email, username, password});
        res.status(200).json(newadvertisor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

