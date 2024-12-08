import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Admin from "../models/adminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import { emailExists, usernameExists, createPromoCode, getConversionRate } from "../utils/Helpers.js";
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
import transactionModel from "../models/transactionsSchema.js";
import PromoCodes from "../models/promoCodesSchema.js";

import productModel from "../models/productSchema.js";


// Creating Tourist for Registration
export const createTourist = async (req, res) => {
    const { email, username, password, mobile, dob, nationality, role, jobTitle, name, address = [], preferedFirstTag, preferedSecondTag, preferedFirstCategory, preferedSecondCategory } = req.body;
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

        const addressArray = Array.isArray(address) ? address : [address];
        const defaultAddress = addressArray[0];

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const customer = await stripe.customers.create({
            name: name,
            email: email,
            phone: mobile,
            address: {
                line1: defaultAddress,
            },
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
            email, username, password: hashedPassword, mobile, dob, nationality, jobTitle, role, name, address: addressArray, defaultAddress, stripeID: customer.id, preferences: { preferredActivities: preferredActivities, preferredItineraries: preferredItineraries }, promoCode: {
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
    if (!req.user) {
        const user = await Tourist.findById("674641df1887b9c3e11436c4");
        return res.status(200).json(user);
    }
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
    const points = req.body.points;

    try {
        const tourist = await Tourist.findById(touristID);



        //verify there are enough points to redeem
        if (points > tourist.loyaltyPoints) {
            return res.status(400).json({ message: "Not enough points to redeem" });
        }

        //deduct points
        const newPoints = tourist.loyaltyPoints - points;
        const newWallet = tourist.wallet + (points * 100) / 10000;

        //update tourist
        const updatedTourist = await Tourist.findOneAndUpdate(
            { _id: touristID },
            { wallet: newWallet, loyaltyPoints: newPoints },
            { new: true }
        );

        //create transaction
        const transaction = await transactionModel.create({ amount: (points * 100) / 10000, incoming: true, userId: touristID, title: "Redeem Points", description: "Redeem Points", method: "wallet" });
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

export const getMyWalletBalance = async (req, res) => {
    const id = "674641df1887b9c3e11436c4";
    const currency = req.query.currency || "USD";
    try {
        const conversionRate = await getConversionRate(currency);


        const tourist = await Tourist.findById(id);
        return res.status(200).json(tourist.wallet * conversionRate);

    }
    catch (error) {
        return res.status(400).send({ message: error.message });
    }
}

export const getMyPromoCodes = async (req, res) => {
    const id = "674641df1887b9c3e11436c4";
    try {
        const tourist = await Tourist.findById(id);
        const promoCodes = await PromoCodes.findOne({ code: tourist.promoCode.code, isBirthDay: true });
        console.log(promoCodes);
        const promocode = { code: tourist.promoCode.code, amount: promoCodes.discount };
        console.log(promocode);
        return res.status(200).json(promocode);
    }
    catch {

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

export const bookmark = async (req, res) => {
    const { touristID, eventID } = req.body;

    try {
        if (!touristID) {
            return res.status(400).json({ message: "Tourist ID is required" });
        }
        const tourist = await Tourist.findById(touristID);
        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        const flagA = false;
        let eventExist = await Itinerary.findById(eventID);
        if (!eventExist) {
            eventExist = await activityModel.findById(eventID);
            flagA = true;
            if (!eventExist) {
                return res.status(404).json({ message: "Event doesn't exist" });
            }
        }

        if (flagA) {
            if (!tourist.savedEvents.savedActivities.includes(eventID)) {
                tourist.savedEvents.savedActivities.push(eventID);
            } else {
                return res.status(400).json({ message: "Activity already bookmarked" });
            }
        }
        else {
            if (!tourist.savedEvents.savedItineraries.includes(event)) {
                tourist.savedEvents.savedItineraries.push(itineraryID);
            } else {
                return res.status(400).json({ message: "Itinerary already bookmarked" });
            }
        }
        await tourist.save();

        return res.status(200).json({ message: "Bookmark saved successfully" });
    } catch (error) {
        console.error("Error in bookmark controller:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const viewBookmarks = async (req, res) => {
    const touristID = req.user._id;

    try {

        const tourist = await Tourist.findById(touristID)
            .populate("savedEvents.savedActivities")
            .populate("savedEvents.savedItineraries");


        const savedActivities = tourist.savedEvents?.savedActivities?.map(activity => ({
            id: activity._id,
            name: activity.name,
            category: activity.categoryID,
        })) || [];

        const savedItineraries = tourist.savedEvents?.savedItineraries?.map(itinerary => ({
            id: itinerary._id,
            name: itinerary.name,
            tags: itinerary.tags,
        })) || [];

        return res.status(200).json({
            savedActivities,
            savedItineraries,
        });
    } catch (error) {
        console.error("Error in viewBookmarks controller:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const AddNewAddress = async (req, res) => {
    const touristID = req.user._id;
    const mainAddress = req.body.address.mainAddress;
    const extraAddresses = req.body.address.extraAddresses;

    console.log("Body: ", req.body);
    console.log("Tourist ID: ", req.user._id);

    try {
        if (!touristID) {
            return res.status(400).json({ message: "Tourist ID is required" });
        }
        if (!mainAddress) {
            return res.status(400).json({ message: "Address is required" });
        }
        const tourist = await Tourist.findById(touristID);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        if (tourist.address.includes(mainAddress)) {
            return res.status(400).json({ message: "Address already exists" });
        }
        if (tourist.address.length == 0) {
            tourist.defaultAddress = mainAddress;
        }

        tourist.address.push(mainAddress);

        if (extraAddresses.length > 0) {
            tourist.address.push(...extraAddresses);
        }

        await tourist.save();

        return res.status(200).json({ message: "Address added successfully", address: tourist.address });
    } catch (error) {
        console.error("Error in AddNewAddress controller:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const setDefaultAddress = async (req, res) => {
    const { touristID, defaultAddress } = req.body;

    try {
        if (!touristID || !defaultAddress) {
            return res.status(400).json({ message: "Tourist ID and default address are required" });
        }

        const tourist = await Tourist.findById(touristID);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }
        y
        if (!tourist.address.includes(defaultAddress)) {
            return res.status(400).json({ message: "Default address must be one of the saved addresses" });
        }
        tourist.defaultAddress = defaultAddress;
        await tourist.save();

        return res.status(200).json({
            message: "Default address set successfully",
            defaultAddress: tourist.defaultAddress,
        });
    } catch (error) {
        console.error("Error setting default address:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const viewAddresses = async (req, res) => {
    const touristID = req.user._id;

    try {
        const tourist = await Tourist.findById(touristID);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }
        const allAddresses = tourist.address;
        const defaultAddress = tourist.defaultAddress;

        return res.status(200).json({
            allAddresses,
            defaultAddress
        });

    } catch (error) {
        console.error("Error retrieving addresses:", error);
        return res.status(500).json({ message: error.message });
    }
};




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

        const wishlistIndex = tourist.wishlist.findIndex(item => item.toString() === productId);
        if(wishlistIndex !== -1){
            await Tourist.findOneAndUpdate(
                {_id: touristId},
                {$pull: {wishlist: productId}},
                {new: true}
            );
        }      

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
    const productId = req.params.productId;
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




export const viewMyWishlist = async (req, res) => {
    const touristID = req.params.id;
    if (!touristID) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }
    try {
        const tourist = await Tourist.findById(touristID).populate('wishlist');
        const wishlist = tourist.wishlist;
        return res.status(200).json(wishlist);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addToWishlist = async (req, res) => {
    const productId = req.body.productID;
    const touristId = req.params.id;
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }

    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        const tourist = await Tourist.findById(touristId);
        if(!tourist){
            return res.status(404).json({message: "Tourist not found"});
        }
        const touristWishlist = tourist.wishlist;
        if(touristWishlist.includes(productId)){
            return res.status(400).json({message: "Product already in wishlist"});
        }
        await Tourist.findByIdAndUpdate(touristId, {$push: {wishlist: productId}}, {new: true}); 
        const newWishlist = await Tourist.findById(touristId).populate('wishlist');
        return res.status(200).json(newWishlist.wishlist);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}

export const removeFromWishlist = async (req, res) => {
    const productId = req.params.productId;
    const touristId = req.params.id;
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }
    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required" });
    }

    try{
        const product = await productModel.findById(productId);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        const tourist = await Tourist.findById(touristId);
        if(!tourist){
            return res.status(404).json({message: "Tourist not found"});
        }
        const touristWishlist = tourist.wishlist;
        if(!touristWishlist.includes(productId)){
            return res.status(400).json({message: "Product not in wishlist"});
        }
        await Tourist.findByIdAndUpdate(touristId, {$pull: {wishlist: productId}}, {new: true}); 
        const newWishlist = await Tourist.findById(touristId).populate('wishlist');
        return res.status(200).json(newWishlist.wishlist);
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}
