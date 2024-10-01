import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";

// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, job, wallet } = req.body; 

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

        // Check if any result exists in any user
        if (isEmailOrUsernameTaken.some(user => user)) {
            return res.status(400).json({ message: "Email or username already taken." });
        }

        // If both email and username are unique, create a new tourist
        const newTourist = await Tourist.create({ email, username, password, mobile, dob, nationality, job, wallet });
        res.status(200).json(newTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Tourist view Profile
export const getTourist = async (req, res) => {
    const { email } = req.params; 

    try {
        //Find by email as it is unique identifier
        const touristProfile = await Tourist.findOne({ email }); 

        res.status(200).json(touristProfile);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// Tourist update data
export const updateTourist = async (req, res) => {
// DOB, Username, Wallet are not changable
    const { username, password, mobile, nationality, job } = req.body;
    const newEmail = req.body.email; 

    try {
        // If a new email is req. to update check if new email is already taken 
        if (newEmail) {
            const isEmailTaken = await Promise.all([
                Tourist.findOne({ email: newEmail }),
                TourGuide.findOne({ email: newEmail }),
                Seller.findOne({ email: newEmail }),
                Advertiser.findOne({ email: newEmail }),
            ]);

            // If the new email is already taken, return an error
            if (isEmailTaken.some(user => user)) {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }

        // Update the tourist's data based on the username
        const updatedTourist = await Tourist.findOneAndUpdate(
            { username },   { email: newEmail, password, mobile, nationality, job },   { new: true }  
        );

        res.status(200).json(updatedTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

