// Exporting models
import adminModel from "../models/adminSchema.js";
import touristGoverner from '../models/touristGovernorScehma.js';
import tourGuide from '../models/tourGuideSchema.js';
import seller from '../models/sellerSchema.js';
import advertiserModel from "../models/advertiserSchema.js";
import tourist from '../models/touristSchema.js';
import activityModel from "../models/activitySchema.js";
import product from "../models/productSchema.js";
import Itinerary from "../models/itinerarySchema.js";

//@desc check if username exists in the database
//@param username
//@return boolean
export const usernameExists = async (username) => {
    if (username === undefined) {
        return false;
    }
    try {
        //check if user exists in tourist collection
        const touristExists = await tourist.findOne({ username: username });
        if (touristExists) {
            return true;
        }

        // Check if user exists in advertiser collection
        const advertiserExists = await advertiserModel.findOne({ username: username });
        if (advertiserExists) {
            return true;
        }

        // Check if user exists in admin collection
        const adminExists = await adminModel.findOne({ username: username });
        if (adminExists) {
            return true;
        }

        // Check if user exists in touristGovernor collection
        const touristGovernorExists = await touristGoverner.findOne({ username: username });
        if (touristGovernorExists) {
            return true;
        }

        //check if user exists in tourGuide collection
        const tourGuideExists = await tourGuide.findOne({
            username: username
        });

        if (tourGuideExists) {
            return true;
        }

        //check if user exists in seller collection
        const sellerExists = await seller.findOne({
            username: username
        });

        if (sellerExists) {
            return true;
        }


        // If not found in any collection, return false
        return false;

    } catch (error) {
        console.error("Error checking username existence:", error.message);
        throw new Error("Error checking username existence");
    }
};


//@desc check if email exists in the database
//@param email
//@return boolean
export const emailExists = async (email) => {
    if (email === undefined) {
        return false;
    }
    try {
        // Check if email exists in tourist collection
        const touristExists = await tourist.findOne({
            email
        });

        if (touristExists) {
            return true;
        }

        // Check if email exists in advertiser collection
        const advertiserExists = await advertiserModel.findOne({ email: email });
        if (advertiserExists) {
            return true;
        }

        // Check if email exists in admin collection
        const adminExists = await adminModel.findOne({ email: email });
        if (adminExists) {
            return true;
        }

        // Check if email exists in touristGovernor collection
        const touristGovernorExists = await touristGoverner.findOne({ email: email });
        if (touristGovernorExists) {
            return true;
        }

        //check if email exists in tourGuide collection
        const tourGuideExists = await tourGuide.findOne({
            email: email
        });
        if (tourGuideExists) {
            return true;
        }

        //check if email exists in seller collection'
        const sellerExists = await seller.findOne({
            email: email
        });
        if (sellerExists) {
            return true;
        }

        // If not found in any collection, return false
        return false;

    } catch (error) {
        console.error("Error checking email existence:", error.message);
        throw new Error("Error checking email existence");
    }
};


export const refundMoney = async (itineraryID) => {

    //fetch itinerary
    const itinerary = await Itinerary.findById(itineraryID);

    //refund money to all subscribers
    for (let i = 0; i < itinerary.subscribers.length; i++) {
        const user = await tourist.findById(itinerary.subscribers[i]);
        user.wallet += itinerary.price;
    }
}

//@description: deletes all products created by a seller
export const deleteProducts = async (sellerID) => {
    //fetch all products created by the seller
    const products = await product.find({ seller_id: sellerID });

    //delete each product
    for (let i = 0; i < products.length; i++) {
        await product.findByIdAndDelete(products[i]._id);
    }
}

//todo:implement this please @youssefrfarid
//@description: deletes all activities created by an advertiser
export const deleteActivities = async (advertiserID) => {
    const activitiesByAdvertiser = await activityModel.deleteMany({ advertiserID: advertiserID });
    console.log(activitiesByAdvertiser.deletedCount, 'activities deleted');
}

export const checkUserExists = async (userId, userType) => {
    let userModel;

    switch (userType) {
        case 'Seller':
            userModel = seller; // Assuming seller is your model for sellers
            break;
        case 'Advertiser':
            userModel = advertiserModel; // Assuming advertiserModel is your model for advertisers
            break;
        case 'Tourist':
            userModel = tourist; // Assuming tourist is your model for tourists
            break;
        case 'Tour Guide':
            userModel = tourGuide; // Assuming tourGuide is your model for tour guides
            break;
        case 'Tourism Governer':
            userModel = touristGoverner; // Assuming touristGoverner is your model for governors
            break;
        default:
            throw new Error("Invalid user type");
    }

    // Check if the user exists in the respective model
    return await userModel.findById(userId);
};