import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({});
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}