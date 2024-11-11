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
// import cloudinary from '../utils/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';

import dotenv from 'dotenv';
import axios from "axios";
import { json } from "express";

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

        // Check if user exists in advertiserModel collection
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

        // Check if email exists in advertiserModel collection
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
//@description: deletes all activities created by an advertiserModel
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
export const addLoyaltyPoints = async (touristID, price) => {
    const subscriber = await tourist.findById(touristID);
    console.log(subscriber);
    const currLevel = subscriber.level;

    let pointsToAdd = 0;
    let newPoints = 0;

    switch (currLevel) {
        case 1:
            pointsToAdd = price * 0.5;
            newPoints = subscriber.loyaltyPoints + pointsToAdd;
            if (newPoints >= 100000) {
                subscriber.level = 2;
            }

            break;
        case 2:
            pointsToAdd = price * 1;
            newPoints = subscriber.loyaltyPoints + pointsToAdd;
            if (newPoints >= 200000) {
                subscriber.level = 3;
            }

            break;
        case 3:
            pointsToAdd = price * 1.5;
            newPoints = subscriber.loyaltyPoints + pointsToAdd;
            break;

        default:
            break;
    }
    console.log("New Points: ", newPoints);
    console.log("Points To Add: ", pointsToAdd);
    subscriber.loyaltyPoints = newPoints;
    console.log(subscriber);
    await subscriber.save();
}

export const convertPrice = async (price, currency) => {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXHANGE_RATE_API_KEY}/pair/${currency}/USD/${price}`);
    return response.data.conversion_result;
}

export const getConversionRate = async (currency) => {
    console.log(currency);
    if (currency === 'EGP') {
        return 48.5;
    }

    if (currency === 'USD') {
        return 1;
    }
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXHANGE_RATE_API_KEY}/pair/USD/${currency}`);
    return response.data.conversion_rate;
}
export const uploadImages = async (filesArray) => {
    const imagesUrls = [];
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // Replace with your Cloudinary cloud name
        api_key: process.env.CLOUDINARY_API_KEY,        // Replace with your API Key
        api_secret: process.env.CLOUDINARY_API_SECRET,  // Replace with your API Secret
    });

    try {
        for (const file of filesArray) {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
            const publicId = sanitizedPublicId;

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: publicId,
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            imagesUrls.push(result.secure_url);
        }

        return { success: true, urls: imagesUrls };
    } catch (error) {
        console.error("Error uploading images:", error.message);
        return { success: false, message: error.message };
    }
}

export const deleteIteneraries = async (tourGuideId) => {
    const itinerariesToDelete = await Itinerary.deleteMany({ tourGuideID: tourGuideId });
    return itinerariesToDelete
}