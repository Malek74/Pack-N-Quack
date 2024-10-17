import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Admin from "../models/adminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { emailExists, usernameExists } from "../utils/Helpers.js";

// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, role, jobTitle, name } = req.body;

    try {
        // Check if the email or username is already taken by any user
        const isEmailTaken = await emailExists(email);
        const isUsernameTaken = await usernameExists(username);

        // Check if any result exists in any user
        if (isEmailTaken) {
            return res.status(400).json({ message: "Email is already taken." });
        }
        if (isUsernameTaken) {
            return res.status(400).json({ message: "Username is already taken." });
        }

        // If both email and username are unique, create a new tourist
        const newTourist = await Tourist.create({ email, username, password, mobile, dob, nationality, jobTitle, role, name });
        res.status(200).json(newTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tourist view Profile
export const getTourist = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        //Find by email as it is unique identifier
        const touristProfile = await Tourist.findById(id);
        return res.status(200).json(touristProfile);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

//@desc Get all tourists
//@route GET /api/tourists
//@access Public
export const getTourists = async (req, res) => {
    try {
        const tourists = await Tourist.find();
        return res.status(200).json(tourists);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }

}
// Tourist update data by username
export const updateTourist = async (req, res) => {
    // DOB, Username, Wallet are not changable
    const username = req.params.id;
    console.log(req.body)
    console.log(username)
    try {
        // If a new email is being passed for update, check if it's already taken
        const newEmail = req.body.email;
        console.log(newEmail);
        if (newEmail != req.body.oldEmail) {
            const doesEmailExists = await emailExists(newEmail);
            console.log(doesEmailExists);
            if (doesEmailExists) {
                return res.status(400).json({ message: "Email is already taken" });
            }
        }
        const updatedTourist = await Tourist.findOneAndUpdate(
            { _id: username },
            req.body,
            { new: true }
        );
        console.log(updatedTourist);
        return res.status(200).json(updatedTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tourist delete by username
export const deleteTourist = async (req, res) => {
    const { username } = req.params;

    try {
        const tourist = await Tourist.findOneAndDelete({ username });
        return res.status(200).json(tourist);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMyBookings = async (req, res) => {
}