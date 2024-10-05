import adminModel from "../models/adminSchema.js";
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernorScehma.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../controllers/Helpers.js';
import tourist from "../models/touristSchema.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({});
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    const role = req.body.role;
    const id = req.params.id;
    let deletedUser;

    //check if user exists
    if (!usernameExists(req.body.username)) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        if (role === "tourGuide") {

            //delete all iteneraries created by the tourguide
            const itineraries = await Itinerary.find({ tourGuideID: id });

            //delete each itirenary and refund money to users
            for (let i = 0; i < itineraries.length; i++) {
                await Itinerary.findByIdAndDelete(itineraries[i]._id);
                refundMoney(itineraries[i]._id);
            }

            //delete the tourguide
            deletedUser = await tourGuide.findByIdAndDelete(id);
        }

        else if (role === "seller") {
            deleteProducts(id);
            deletedUser = await seller.findByIdAndDelete(id);
        }

        else if (role === "advertiser") {
            deleteActivities(id);
            deletedUser = await advertiserModel.findByIdAndDelete(id);
        }

        else if (role === "tourist") {
            deletedUser = await tourist.findByIdAndDelete(id);
        }

        else if (role === "touristGovernor") {
            deletedUser = await touristGovernor.findByIdAndDelete(id);
        }

        else {
            return res.status(404).json({ message: "Role not found" });
        }
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}


//todo:implement this please @youssefrfarid
//@description: deletes all activities created by an advertiser
export const deleteActivities = async (advertiserID) => {

}

export const addAdmin = async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await adminModel.findOne({ username });
    if (adminExists) {
        return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new adminModel({ username, password });
    try {
        const a = await newAdmin.save();
        res.status(200).json(a);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

