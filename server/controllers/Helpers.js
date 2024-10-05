// Exporting models
import adminModel from "../models/adminSchema.js";
import touristGoverner from '../models/touristGovernorScehma.js';
import tourGuide from '../models/tourGuideSchema.js';
import seller from '../models/sellerSchema.js';
import advertiserModel from "../models/advertiserSchema.js";
import tourist from '../models/touristSchema.js';

//@desc check if username exists in the database
//@param username
//@return boolean
export const usernameExists = async (username) => {
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