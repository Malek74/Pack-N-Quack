import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Admin from "../models/adminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { emailExists, usernameExists } from "../utils/Helpers.js";
import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import Places from "../models/PlacesSchema.js";
import Stripe from "stripe";
import Booking from "../models/bookingsSchema.js";

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

        //create stripe account
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const customer = await stripe.customers.create({
            name: name,
            email: email,
            phone: mobile,
        });


        // If both email and username are unique, create a new tourist
        const newTourist = await Tourist.create({ email, username, password, mobile, dob, nationality, jobTitle, role, name, stripeID: customer.id });
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
    try {
        const myBookings = await Booking.find({ touristID: req.params.id });

        return res.status(200).json(myBookings);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//@desc Get my preferences
//@route GET /api/tourist/preference/:id
export const getMyprefernces = async (req, res) => {
    const id = req.params.id;

    try {
        const tourist = await Tourist.findById(id);
        const prefereredActivities = await tourist.preferences.preferredActivities;
        const prefereredItineraries = await tourist.preferences.preferredItineraries;
        const preferredPlaces = await tourist.preferences.preferredPlaces;

        let activities = [];
        let itineraries = [];
        let places = [];

        console.log(prefereredActivities);
        console.log(prefereredItineraries);
        console.log(preferredPlaces);

        //get activities based on tags
        activities.push(... await activityModel.find({ 'categoryID': { $in: prefereredActivities } }));

        //get itineraries based on tags
        itineraries.push(... await Itinerary.find({ 'tags': { $in: prefereredItineraries } }));

        //get places based on tags
        places.push(... await Places.find({ 'tags': { $in: place._id } }));

        const result = {
            activites: activities,
            itineraries: itineraries,
            places: places
        };
        console.log(result);

        return res.status(200).json(result);

    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const redeemPoints = async (req, res) => {
    const touristID = req.params.id;

    try {
        const tourist = await Tourist.findById(touristID);

        const canBeRedeemed = Math.floor(tourist.loyaltyPoints / 10000);

        //verify there are enough points to redeem
        if (canBeRedeemed == 0) {
            return res.status(400).json({ message: "Not enough points to redeem" });
        }

        //deduct points
        const newPoints = tourist.loyaltyPoints - canBeRedeemed * 10000;
        const newWallet = tourist.wallet + canBeRedeemed * 100;

        //update tourist
        const updatedTourist = await Tourist.findOneAndUpdate(
            { _id: touristID },
            { wallet: newWallet, loyaltyPoints: newPoints },
            { new: true }
        );

        return res.status(200).json(updatedTourist);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }

}