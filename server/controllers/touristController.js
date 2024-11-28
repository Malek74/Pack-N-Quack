import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Admin from "../models/adminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { emailExists, usernameExists, createPromoCode } from "../utils/Helpers.js";
import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import Places from "../models/PlacesSchema.js";
import Stripe from "stripe";
import Booking from "../models/bookingSchema.js";
import AmadeusBooking from "../models/amadeusBooking.js";
import DeleteRequest from "../models/deleteRequests.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";


// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, role, jobTitle, name, preferedFirstTag, preferedSecondTag, preferedFirstCategory, preferedSecondCategory } = req.body;
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

        const preferredActivities = [preferedFirstCategory, preferedSecondCategory];
        const preferredItineraries = [preferedFirstTag, preferedSecondTag];


        // If both email and username are unique, create a new tourist
        const salt = await bcrypt.genSalt(); //generate salt to randomise the password hash (distinct between users with the same password)
        const hashedPassword = await bcrypt.hash(password, salt);

        //generate a promocode for the user

        const initials = name.split(" ").map((word) => word.charAt(0)).join("");
        console.log(initials);
        //concatenate the initials with a random number
        const code = initials + 10;

        //create the promo code
        await createPromoCode(code, 10, true);


        const newTourist = await Tourist.create({
            email, username, password: hashedPassword, mobile, dob, nationality, jobTitle, role, name, stripeID: customer.id, preferences: { preferredActivities: preferredActivities, preferredItineraries: preferredItineraries }, promoCode: {
                code: code,
                lastUsed: null
            }
        });
        
        //create admin token
        const token = createToken(username, newTourist._id, "Tourist");
        res.cookie("jwt", token, { httpOnly: true });
        console.log(token); res.status(200).json(newTourist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Tourist view Profile
export const getTourist = async (req, res) => {

    return res.status(200).json(req.user);
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
    console.log(req.body)
    const user = req.user;

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

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
            { _id: user._id },
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
    const user = req.user;

    try {

        const tourist = await Tourist.findByIdAndDelete(user._id);

        const deleteRequest = await DeleteRequest.create({ userID: tourist._id, status: "approved", userType: "Tourist", email: tourist.email, username: tourist.username, name: tourist.name, mobile: tourist.mobile });

        return res.status(200).json(tourist);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMyBookings = async (req, res) => {

    const id = req.user._id;
    const eventType = req.body.eventType;
    console.log(req.body);
    try {

        if (eventType == "activity") {
            const myBookings = await Booking.find({ touristID: id, itineraryID: null, transportationID: null }).populate('activityID');
            console.log(myBookings);
            return res.status(200).json(myBookings);
        }
        else if (eventType == "itinerary") {
            const myBookings = await Booking.find({ touristID: id, activityID: null, transportationID: null }).populate({
                path: 'itineraryID',
                populate: {
                    path: 'tags', // Field in Itinerary schema to populate
                    model: 'itineraryTags' // The model name for the referenced field
                }
            });
            return res.status(200).json(myBookings);
        }
        else if (eventType == "transportation") {
            const myTransportation = await Booking.find({ touristID: id, activityID: null, itineraryID: null }).populate('transportationID');
            const myFlights = await AmadeusBooking.find({ touristID: id, flightData: { $exists: true }, hotelData: { $exists: false } });
            const myHotels = await AmadeusBooking.find({ touristID: id, flightData: { $exists: false }, hotelData: { $exists: true } });
            return res.status(200).json({ transportations: myTransportation, flights: myFlights, hotels: myHotels });
        }

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//@desc Get my preferences
//@route GET /api/tourist/preference/:id
export const getMyprefernces = async (req, res) => {
    const id = req.user._id;

    try {
        const tourist = await Tourist.findById(id);
        const prefereredActivities = tourist.preferences.preferredActivities;
        const prefereredItineraries = tourist.preferences.preferredItineraries;

        let activities = [];
        let itineraries = [];

        console.log(prefereredActivities);
        console.log(prefereredItineraries);

        //get activities based on tags
        activities.push(... await activityModel.find({ 'tags': { $in: prefereredItineraries } }).populate('tags categoryID'));

        //get itineraries based on tags
        itineraries.push(... await Itinerary.find({ 'tags': { $in: prefereredItineraries } }).populate('tags'));

        //get activities based on categories
        activities.push(... await activityModel.find({ 'categoryID': { $in: prefereredActivities } }).populate('tags categoryID'));

        const result = {
            activites: activities,
            itineraries: itineraries,
            //    places: places
        };
        console.log(result);

        return res.status(200).json(result);

    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const redeemPoints = async (req, res) => {
    const touristID = req.user._id;

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

export const getMyFlights = async (req, res) => {
    const id = req.user._id;

    try {
        const myBookings = await AmadeusBooking.find({ touristID: id, flightData: { $exists: true }, hotelData: { $exists: false } });
        return res.status(200).json(myBookings);

    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const getMyHotels = async (req, res) => {
    const id = req.user._id;

    try {
        const myBookings = await AmadeusBooking.find({ touristID: id, flightData: { $exists: false }, hotelData: { $exists: true } });
        return res.status(200).json(myBookings);

    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
}


//TODO: edit so that the Itinerary status is confirmed
export const viewMyTourGuides = async (req, res) => {
    const touristID = req.user._id;
    if (!touristID) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }
    try {
        const myBookings = await Booking.find(
            { touristID: touristID, date: { $lte: new Date() } }
        );

        const myItineraries = await Itinerary.find(
            { _id: { $in: myBookings.map(booking => booking.itineraryID) } }
        );

        const myItineraryTourGuides = await TourGuide.find(
            { _id: { $in: myItineraries.map(itinerary => itinerary.tourGuideID) } })
            .select('username email _id');

        return res.status(200).json(myItineraryTourGuides);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//TODO: edit so that the Itinerary status is confirmed
export const viewMyItineraries = async (req, res) => {
    const touristID = req.user._id;
    if (!touristID) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }
    try {
        const myBookings = await Booking.find(
            { touristID: touristID, date: { $lte: new Date() } }
        );

        const myItineraries = await Itinerary.find(
            { _id: { $in: myBookings.map(booking => booking.itineraryID) } }
        );

        return res.status(200).json(myItineraries);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//TODO: edit so that the Activity status is confirmed
export const viewMyActivities = async (req, res) => {
    const touristID = req.user._id;
    if (!touristID) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }
    try {
        const myBookings = await Booking.find(
            { touristID: touristID, date: { $lte: new Date() } }
        );
        const myActivities = await activityModel.find(
            { _id: { $in: myBookings.map(booking => booking.activityID) } }
        );
        return res.status(200).json(myActivities);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

