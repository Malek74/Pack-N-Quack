import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import adminModel from '../models/adminSchema.js';
import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernorScehma.js";
import Seller from "../models/sellerSchema.js";
import Advertiser from "../models/advertiserSchema.js";
config();


export const protect = async (req, res, next) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        let user;

        switch (decoded.role) {
            case "Admin":
                user = await adminModel.findById(decoded.id);
                break;

            case "Advertiser":
                user = await Advertiser.findById(decoded.id);
                break;

            case "Tourist":
                user = await Tourist.findById(decoded.id);
                break;

            case "Tour Guide":
                user = await TourGuide.findById(decoded.id);
                break;

            case "Tourist Governor":
                user = await TouristGovernor.findById(decoded.id);
                break;

            case "Seller":
                user = await Seller.findById(decoded.id);
                break;

            default:
                user = null;
                break;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

