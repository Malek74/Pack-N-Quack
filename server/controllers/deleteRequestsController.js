import DeleteRequest from '../models/deleteRequests.js';
import activityModel from "../models/activitySchema.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import { addLoyaltyPoints, refundMoney, deleteProducts } from "../utils/Helpers.js";
import Booking from "../models/bookingSchema.js";
import Activity from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import tourGuide from '../models/tourGuideSchema.js';
import seller from '../models/sellerSchema.js';
import product from "../models/productSchema.js";

//get all delete requests
export const getDeleteRequests = async (req, res) => {
    try {
        const deleteRequests = await DeleteRequest.find({});
        res.status(200).json(deleteRequests);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const handleDeleteRequest = async (req, res) => {
    const { name, email, userType } = req.body;

    switch (userType) {
        case 'Seller':

            try {
                //fetch seller
                const sellerFound = await seller.find({ email: email, username: name });

                //fetch all products of the seller
                const products = await product.deleteMany({ sellerID: sellerFound._id });

                //remove delete request
                await DeleteRequest.findOneAndDelete({ email: email, name: name, userType: userType });

                console.log(products);

                return res.status(200).json({ message: `Account deleted successfully` });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
            break;

        case 'Tourist':

            //remove delete request
            await DeleteRequest.findOneAndDelete({ email: email, name: name, userType: userType });

            await Tourist.deleteOne({ name: name, email: email });

            return res.status(200).json({ message: `Delete Request created successfully` });

        case 'Tour Guide':

            try {

                const userId = await tourGuide.findOne({ email: email, username: name })._id;
                const myItineraries = await Itinerary.find({ tourGuideID: userId });

                //delete all itineraries 
                await Itinerary.deleteMany({ tourGuideID: userId });

                //delete the requests
                await DeleteRequest.findOneAndDelete({ email: email, name: name, userType: userType });

                //delete tour guide
                await tourGuide.findByIdAndDelete(userId);

                return res.status(200).json({ message: "User deleted successfully." });
            } catch (error) {
                return res.status(404).json({ message: error.message });
            }
        case 'Advertiser':

            try {

                //fetch advertiser
                const advertiser = await advertiserModel.findOne({ email: email, username: name });

                //fetch all activities of the advertiser
                const activities = await activityModel.deleteMany({ advertiserID: advertiser._id });


                //delete the requests
                await DeleteRequest.findOneAndDelete({ email: email, name: name, userType: userType });

                //delete advertiser
                await advertiserModel.findByIdAndDelete(advertiser._id);

                return res.status(200).json({ message: `User deleted successfully` });

            } catch (error) {
                res.status(404).json({ message: error.message });
            }
        default:
            return res.status(400).json({ message: "Invalid user type" });
    }

}