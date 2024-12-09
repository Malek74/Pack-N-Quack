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
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import axios from "axios";
import { json } from "express";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Stripe from "stripe";
import PromoCodes from "../models/promoCodesSchema.js";
import nodemailer from "nodemailer";
import { config } from "dotenv";

config();

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


export const getUsersTodayBirthdays = async () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;

    try {
        const tourists = await tourist.find({
            $expr: {
                $and: [
                    { $eq: [{ $dayOfMonth: "$dob" }, day] },
                    { $eq: [{ $month: "$dob" }, month] }
                ]
            }
        });
        return tourists;

    }
    catch (error) {
        console.log(error);
    }
}

export const getUserRole = async (username) => {
    let userRole = '';
    let user = await tourist.findOne({ username });
    if (user) {
        userRole = 'Tourist';
        return userRole;

    } else {
        user = await advertiserModel.findOne({ username });
        if (user) {
            userRole = 'Advertiser';
            return userRole;

        } else {
            user = await tourGuide.findOne({ username });
            if (user) {
                userRole = 'Tour Guide';
                return userRole;

            } else {
                user = await touristGoverner.findOne({ username });
                if (user) {
                    userRole = 'Tourism Governer';
                    return userRole;

                } else {
                    user = await seller.findOne({ username });
                    if (user) {
                        userRole = 'Seller';
                        return userRole;
                    }
                    else {
                        user = await adminModel.findOne({ username });
                        if (user) {
                            userRole = 'Admin';
                            return userRole;
                        }
                    }
                }

            }
        }
    }
    return userRole;
}

export const createToken = (username, id, role, socketId) => {
    return jwt.sign({ id, username, role, socketId }, process.env.JWT_SECRET_KEY, {
        expiresIn: 24 * 60 * 60 //
    });

};


export const createPromoCode = async (promocode, discount, isBirthDay) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


    try {
        const coupon = await stripe.coupons.create({
            percent_off: discount, // Adjust discount percentage as needed
            duration: 'repeating', // Each user can apply it only once per use
            name: promocode, // Name for the coupon
            duration_in_months: 1, // Duration of the discount
        });


        // Create a promotion code linked to the coupon ID
        const promoCode = await stripe.promotionCodes.create({
            coupon: coupon.id, // Reference to an existing coupon
            code: promocode, // The promotion code users will enter
            max_redemptions: 50, // Unlimited total redemptions
        });

        // Save promotion code details to your database
        await PromoCodes.create({
            code: promoCode.code,
            discount,
            isBirthDay,
            stripeID: promoCode.id,
        });

        console.log(`Promotion code ${promocode} created successfully!`);
        return promoCode;
    } catch (error) {
        console.error('Error creating promo code:', error);
        throw new Error('Failed to create promotion code');
    }
};


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // Or 587 for other providers
    secure: true, // true for 465, false for 587
    auth: {
        user: 'captianquackerss@gmail.com', // organization's email
        pass: process.env.EMAIL_PASSKEY, // your email password
    },
});
export const sendEventFlaggedEmail = async (email, username, eventName, eventDate) => {

    try {
        const mailOptions = {
            from: '"CaptainQuackers" <captianquackerss@gmail.com>',
            to: email,
            subject: `Important: Your Event Has Been Flagged Inappropriate`,
            text: `Hello ${username}, your event titled "${eventName}" has been flagged as inappropriate. It will be reviewed shortly.`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #FF6347;">Important Notice: Your Event Has Been Flagged Inappropriate</h1>
                <p>Hello ${username},</p>
                <p>We regret to inform you that your event titled "<strong>${eventName}</strong>" scheduled on ${eventDate} has been flagged as inappropriate by our moderation team.</p>
                <p>We take community safety seriously, and we have temporarily suspended your event pending further review. If you believe this is an error, please reach out to our support team to dispute this decision.</p>
                <h3>Event Details:</h3>
                <p><strong>Event Name:</strong> ${eventName}</p>
                <p><strong>Event Date:</strong> ${eventDate}</p>
                <p>If you have any questions or concerns, feel free to contact our support team at <a href="mailto:support@yourwebsite.com">support@yourwebsite.com</a>.</p>
                <p>We appreciate your cooperation in maintaining a respectful and safe platform for all users.</p>
                <p>Best regards,<br>Captain Quackers and the Pack N Quack Team</p>
                <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px;height:auto; margin-top: 20px;" />
            </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: '../client/public/assets/icons/logo.png',
                    cid: 'logo',
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }

};