import admin from "../models/adminSchema.js";
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiser from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernorScehma.js";
import { usernameExists } from '../controllers/Helpers.js';
import tourist from "../models/touristSchema.js";


export const getAdmins = async (req, res) => {
    try {
        const admins = await admin.find({});
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
            deletedUser = await advertiser.findByIdAndDelete(id);
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

const refundMoney = async (itineraryID) => {

    //fetch itinerary
    const itinerary = await Itinerary.findById(itineraryID);

    //refund money to all subscribers
    for (let i = 0; i < itinerary.subscribers.length; i++) {
        const user = await tourist.findById(itinerary.subscribers[i]);
        user.wallet += itinerary.price;
    }
}

//todo:implement this please @GasserAli
//@description: deletes all products created by a seller
const deleteProducts = async (sellerID) => {

}

//todo:implement this please @GasserAli
//@description: deletes all activities created by an advertiser
const deleteActivities = async (advertiserID) => { }
