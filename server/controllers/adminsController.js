
import adminModel from "../models/adminSchema.js";
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernorScehma.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../utils/Helpers.js';
import tourist from "../models/touristSchema.js";
import Itinerary from "../models/itinerarySchema.js";
import { PasswordChangeRequest } from "../models/changePassSchema.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";



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

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new adminModel({ username, password: hashedPassword });

    // Create a token for the user
    const token = createToken(username, newAdmin._id, "Admin");

    // Send the token in the response
    res.cookie("jwt", token, { httpOnly: true });

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


export const handlePasswordChangeRequest = async (req, res) => {
    const { requestId, action } = req.body;

    if (!requestId || !['approve', 'decline'].includes(action)) {
        return res.status(400).json({ message: "Request ID and valid action (approve/decline) are required" });

    }

    try {
        const request = await PasswordChangeRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Password change request not found" });
        }

        if (action === 'approve') {
            let userModel;

            // a use el helper or not ?
            switch (request.userType) {
                case 'Seller':
                    userModel = seller;
                    break;
                case 'Advertiser':
                    userModel = advertiserModel;
                    break;
                case 'Tourist':
                    userModel = tourist;
                    break;
                case 'Tour Guide':
                    userModel = tourGuide;
                    break;
                case 'Tourism Governer':
                    userModel = touristGoverner;
                    break;
                default:
                    return res.status(400).json({ message: "Invalid user type" });
            }

            //hash the password
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(request.requestedPassword, salt);
            await userModel.findByIdAndUpdate(request.userId, { password: hashedPassword });
            request.status = 'approved';
        } else {
            request.status = 'declined';
        }

        await request.save();
        res.status(200).json({ message: `Password change request ${request.status}` });
    } catch (error) {
        console.error("Error handling password change request:", error);
        res.status(500).json({ message: error.message });
    }
};

export const getPendingPasswordChangeRequests = async (req, res) => {
    try {
        // Find all requests with status "pending"
        const pendingRequests = await PasswordChangeRequest.find({ status: 'pending' });

        // Prepare an array to store the requests with user details
        const requestsWithUserDetails = await Promise.all(
            pendingRequests.map(async (request) => {
                let userModel;

                // Determine the user model based on user type
                switch (request.userType) {
                    case 'Seller':
                        userModel = seller;
                        break;
                    case 'Advertiser':
                        userModel = advertiserModel;
                        break;
                    case 'Tourist':
                        userModel = tourist;
                        break;
                    case 'Tour Guide':
                        userModel = tourGuide;
                        break;
                    case 'Tourism Governer':
                        userModel = touristGoverner;
                        break;
                    default:
                        return null;
                }

                try {
                    // Fetch user details from the respective model
                    const user = await userModel.findById(request.userId).select('name email');
                    return {
                        requestId: request._id,
                        userType: request.userType,
                        userId: request.userId,
                        userName: user ? user.name : 'Unknown',
                        userEmail: user ? user.email : 'Unknown',
                        requestedPassword: request.requestedPassword,
                        status: request.status,
                        createdAt: request.createdAt
                    };
                } catch (userError) {
                    console.error(`Error fetching user details for request ${request._id}:`, userError);
                    return {
                        requestId: request._id,
                        userType: request.userType,
                        userId: request.userId,
                        userName: 'Unknown',
                        userEmail: 'Unknown',
                        requestedPassword: request.requestedPassword,
                        status: request.status,
                        createdAt: request.createdAt
                    };
                }
            })
        );

        // Filter out any null results from unmapped user types
        const filteredRequests = requestsWithUserDetails.filter(request => request !== null);

        res.status(200).json(filteredRequests);
    } catch (error) {
        console.error("Error retrieving pending password change requests:", error);
        res.status(500).json({ message: error.message });
    }
};

export const acceptOrReject = async (req, res) => {
    const { userId, userType, flag } = req.body;
    let userModel;
    console.log(req.body);

    switch (userType) {
        case 'Seller':
            userModel = seller;
            break;
        case 'Advertiser':
            userModel = advertiserModel;
            break;
        case 'Tour Guide':
            userModel = tourGuide;
            break;
        default:
            return res.status(400).json({ message: "Invalid user type" });
    }

    try {
        const userExist = await userModel.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, { $set: { "isAccepted": flag } }, { new: true })

        if (flag) {
            return res.status(200).json(updatedUser);
        }
        else {
            await userModel.findByIdAndDelete(userId);
            return res.status(200).json({ message: "User rejected and deleted." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}