import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";

export const createTouristGovernor = async (req, res) => {
    const { username, password} = req.body; 

    try {
        // Check if the email or username is already taken by any user
        const isEmailOrUsernameTaken = await Promise.all([
            Tourist.findOne({ username }),
            TourGuide.findOne({ username }),
            Seller.findOne({ username }),
            Admin.findOne( { username }),
            Advertiser.findOne({ username }),
        ]);

        if (isEmailOrUsernameTaken.some(user => user)) {
            return res.status(400).json({ message: "Email or username already taken." });
        }
        const newtouristGovernor = await TouristGovernor.create({username, password});
        res.status(200).json(newtouristGovernor);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

