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
import Booking from "../models/bookingSchema.js";
import AmadeusBooking from "../models/amadeusBooking.js";
import DeleteRequest from "../models/deleteRequests.js";
import productModel from "../models/productSchema.js";

// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, role, jobTitle, name, preferedFirstTag, preferedSecondTag, preferedFirstCategory, preferedSecondCategory } = req.body;
    console.log(req.body);
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
        console.log(preferredActivities);
        console.log(preferredItineraries);

        // If both email and username are unique, create a new tourist
        const newTourist = await Tourist.create({ email, username, password, mobile, dob, nationality, jobTitle, role, name, stripeID: customer.id, preferences: { preferredActivities: preferredActivities, preferredItineraries: preferredItineraries } });
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

        const deleteRequest = await DeleteRequest.create({ userID: tourist._id, status: "approved" });

        return res.status(200).json(tourist);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getMyBookings = async (req, res) => {

    const id = req.params.id;
    const eventType = req.body.eventType;
    console.log(req.body);
    try {

        if (eventType == "activity") {
            const myBookings = await Booking.find({ touristID: req.params.id, itineraryID: null, transportationID: null }).populate('activityID');
            return res.status(200).json(myBookings);
        }
        else if (eventType == "itinerary") {
            const myBookings = await Booking.find({ touristID: req.params.id, activityID: null, transportationID: null }).populate({
                path: 'itineraryID',
                populate: {
                    path: 'tags', // Field in Itinerary schema to populate
                    model: 'itineraryTags' // The model name for the referenced field
                }
            });
            return res.status(200).json(myBookings);
        }
        else if (eventType == "transportation") {
            const myTransportation = await Booking.find({ touristID: req.params.id, activityID: null, itineraryID: null }).populate('transportationID');
            const myFlights = await AmadeusBooking.find({ touristID: req.params.id, flightData: { $exists: true }, hotelData: { $exists: false } });
            const myHotels = await AmadeusBooking.find({ touristID: req.params.id, flightData: { $exists: false }, hotelData: { $exists: true } });
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
    const id = req.params.id;

    try {
        const tourist = await Tourist.findById(id);
        const prefereredActivities =  tourist.preferences.preferredActivities;
        const prefereredItineraries =  tourist.preferences.preferredItineraries;

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

export const getMyFlights = async (req, res) => {
    const id = req.params.id;

    try {
        const myBookings = await AmadeusBooking.find({ touristID: id, flightData: { $exists: true }, hotelData: { $exists: false } });
        return res.status(200).json(myBookings);

    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const getMyHotels = async (req, res) => {
    const id = req.params.id;

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
    const touristID = req.params.id;
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
    const touristID = req.params.id;
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
    const touristID = req.params.id;
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

export const getCart = async (req, res) => {
    const touristId = req.params.id;

    if(!touristId){
        return res.status(400).json({message: "Tourist ID is required"});
    }

    try{
        const tourist = await Tourist.findById(touristId).populate('cart.productID');
        return res.status(200).json(tourist.cart);
    }catch(error){
        console.error(error);
        return res.status(500).json({message: error.message});
    }
}

export const addItemToCart = async (req, res) => {
    const productId = req.body.productID;
    const touristId = req.params.id;
    const quantity = req.body.quantity;

    if(!productId){
        return res.status(400).json({message: "Product ID is required"});
    }

    if(!touristId){
        return res.status(400).json({message: "Tourist ID is required"});
    }

    if(!quantity || quantity <= 0){
        return res.status(400).json({message: "Quantity is required"});
    }
    try{
        const tourist = await Tourist.findById(touristId);
        if(!tourist){
            return res.status(404).json({message: "Tourist not found"});
        }

        const product = await productModel.findById(productId);
        
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }

        const productIndex = tourist.cart.findIndex(item => item.productID.toString() === productId);
        const oldQuantity = productIndex !== -1 ? tourist.cart[productIndex].quantity : 0;

        if (productIndex !== -1) {
            // Product exists in the cart - Update its quantity
            const updatedCart = await Tourist.findOneAndUpdate(
                { _id: touristId, "cart.productID": productId },
                { $set: { "cart.$.quantity": quantity + oldQuantity } },
                { new: true }
            ).populate('cart.productID');

            return res.status(200).json(updatedCart.cart);
        } else {
            // Product does not exist - Add it to the cart
            const updatedCart = await Tourist.findByIdAndUpdate(
                touristId,
                { $push: { cart: { productID: productId, quantity: quantity } } },
                { new: true }
            ).populate('cart.productID');

            return res.status(200).json(updatedCart.cart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const removeItemFromCart = async (req, res) => {
    const productId = req.body.productID;
    const touristId = req.params.id;

    if(!productId){
        return res.status(400).json({message: "Product ID is required"});
    }

    if(!touristId){
        return res.status(400).json({message: "Tourist ID is required"});
    }

    try{
        const tourist = await Tourist.findById(touristId);
        if(!tourist){
            return res.status(404).json({message: "Tourist not found"});
        }

        const productIndex = tourist.cart.findIndex(item => item.productID.toString() === productId);

        if (productIndex !== -1) {
            // Product exists in the cart - Remove it
            const updatedCart = await Tourist.findByIdAndUpdate(
                touristId,
                { $pull: { cart: { productID: productId } } },
                { new: true }
            ).populate('cart.productID');

            return res.status(200).json(updatedCart.cart);
        } else {
            return res.status(404).json({message: "Product not found in cart"});
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateQuantityInCart = async (req, res) => {
    const productId = req.body.productID;
    const touristId = req.params.id;

    if(!productId){
        return res.status(400).json({message: "Product ID is required"});
    }

    if(!touristId){
        return res.status(400).json({message: "Tourist ID is required"});
    }

    try{
        const tourist = await Tourist.findById(touristId);
        if(!tourist){
            return res.status(404).json({message: "Tourist not found"});
        }

        const productIndex = tourist.cart.findIndex(item => item.productID.toString() === productId);

        if (productIndex !== -1) {
            if(req.body.quantity < 0){
                return res.status(400).json({message: "Quantity cannot be negative"});
            }
            if(req.body.quantity === 0){
                // Quantity is 0 - Remove the item from the cart
                const updatedCart = await Tourist.findByIdAndUpdate(
                    touristId,
                    { $pull: { cart: { productID: productId } } },
                    { new: true }
                ).populate('cart.productID');
    
                return res.status(200).json(updatedCart.cart);
            }
            // Product exists in the cart - Update its quantity
            const updatedCart = await Tourist.findOneAndUpdate(
                { _id: touristId, "cart.productID": productId },
                { $set: { "cart.$.quantity": req.body.quantity } },
                { new: true }
            ).populate('cart.productID');

            return res.status(200).json(updatedCart.cart);
        } else {
            return res.status(404).json({message: "Product not found in cart"});
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({message: error.message});
    }
}


