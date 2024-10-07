
import adminModel from "../models/adminSchema.js";
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernorScehma.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../controllers/Helpers.js';
import tourist from "../models/touristSchema.js";
import Itinerary from "../models/itinerarySchema.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.find({});
        return res.status(200).json(admins);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}


export const deleteUser = async (req, res) => {
    console.log(req.body);
    const userType = req.body.userType;
    const id = req.params.id;
    let deletedUser;

    //check if user exists
    if (!usernameExists(req.body.username)) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        if (userType === "tourGuide") {

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

        else if (userType === "seller") {
            deleteProducts(id);
            deletedUser = await seller.findByIdAndDelete(id);
        }

        else if (userType === "advertiser") {
            deleteActivities(id);
            deletedUser = await advertiserModel.findByIdAndDelete(id);
        }

        else if (userType === "tourist") {
            deletedUser = await tourist.findByIdAndDelete(id);
        }

        else if (userType === "touristGovernor") {
            deletedUser = await touristGoverner.findByIdAndDelete(id);
        }
        else if (userType === "admin") {
            deletedUser = await adminModel.findByIdAndDelete(id);
        }
        else {
            return res.status(404).json({ message: "Role not found" });
        }
        console.log(userType)
        console.log(deletedUser);
        return res.status(200).json(deletedUser);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}



export const addAdmin = async (req, res) => {
    const { username, password } = req.body;
    const adminExists = await usernameExists(username);
    if (adminExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const newAdmin = new adminModel({ username, password });
    console.log(newAdmin);
    try {
        const a = await newAdmin.save();
        return res.status(200).json(a);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        // Fetch users from different schemas
        const admins = await adminModel.find({});
        const advertisers = await advertiserModel.find({});
        const tourists = await tourist.find({});
        const governors = await touristGoverner.find({});
        const sellers = await seller.find({});
        const tourGuides = await tourGuide.find({});

        // Append the role to each set of users
        const allAdmins = admins.map(user => ({ ...user.toObject(), userType: 'admin' }));
        const allAdvertisers = advertisers.map(user => ({ ...user.toObject(), userType: 'advertiser' }));
        const allTourists = tourists.map(user => ({ ...user.toObject(), userType: 'tourist' }));
        const allGovernors = governors.map(user => ({ ...user.toObject(), userType: 'touristGovernor' }));
        const allSellers = sellers.map(user => ({ ...user.toObject(), userType: 'seller' }));
        const allTourGuides = tourGuides.map(user => ({ ...user.toObject(), userType: 'tourGuide' }));

        // Combine all users into one array
        const allUsers = [...allAdmins, ...allAdvertisers, ...allTourists, ...allGovernors, ...allSellers, ...allTourGuides];

        // Send the combined array as response
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
