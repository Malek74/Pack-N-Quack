
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
import { createToken, createPromoCode } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";
import PromoCodes from "../models/promoCodesSchema.js";
import Orders from "../models/orderSchema.js";
import Bookings from "../models/bookingSchema.js";



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

//create promocode

export const adminCreatePromoCode = async (req, res) => {
    const { code, amount } = req.body;
    console.log(req.body);
    if (!code || !amount) {
        return res.status(400).json({ message: "Please provide code and amount" });
    }

    try {
        const promoCodeExists = await PromoCodes.find({ code: code });

        if (promoCodeExists.length > 0) {
            return res.status(400).json({ message: "Promocode already exists" });
        }

        await createPromoCode(code, amount, false);

        return res.status(200).send({ message: "Promocode created successfully" })

    }

    catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error While creating the code" });
    }

}

export const getAllPromoCodes = async (req, res) => {
    try {
        const promocodes = await PromoCodes.find({ isBirthDay: false });
        res.status(200).json(promocodes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getTotalUsersNum = async (req, res) => {
    try {
        //Fetch users from different schemas
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

        const totalUsers =
            allAdmins.length +
            allAdvertisers.length +
            allTourists.length +
            allGovernors.length +
            allSellers.length +
            allTourGuides.length;

        return res.status(200).json({ totalUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getTotalNewUsersCount = async (req, res) => {
    try {
        const month = new Date();
        month.setMonth(month.getMonth() - 1); //bageeb from the date el shahr el fat

        const admins = await adminModel.find({ createdAt: { $gte: month } });
        const advertisers = await advertiserModel.find({ createdAt: { $gte: month } });
        const tourists = await tourist.find({ createdAt: { $gte: month } });
        const governors = await touristGoverner.find({ createdAt: { $gte: month } });
        const sellers = await seller.find({ createdAt: { $gte: month } });
        const tourGuides = await tourGuide.find({ createdAt: { $gte: month } });

        const allAdmins = admins.map(user => ({ ...user.toObject(), userType: 'admin' }));
        const allAdvertisers = advertisers.map(user => ({ ...user.toObject(), userType: 'advertiser' }));
        const allTourists = tourists.map(user => ({ ...user.toObject(), userType: 'tourist' }));
        const allGovernors = governors.map(user => ({ ...user.toObject(), userType: 'touristGovernor' }));
        const allSellers = sellers.map(user => ({ ...user.toObject(), userType: 'seller' }));
        const allTourGuides = tourGuides.map(user => ({ ...user.toObject(), userType: 'tourGuide' }));

        // Calculate total number of new users
        const totalNewUsers =
            allAdmins.length +
            allAdvertisers.length +
            allTourists.length +
            allGovernors.length +
            allSellers.length +
            allTourGuides.length;

        // Send response
        return res.status(200).json({ totalNewUsers });
    } catch (error) {
        // Handle errors
        return res.status(500).json({ message: error.message });
    }
};


export const deletePromoCode = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        await PromoCodes.findByIdAndDelete(id);
        return res.status(200).json({ message: "Promocode deleted successfully" });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getRevenue = async (req, res) => {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate || new Date();
    const productIDs = req.query.products;
    try{

        const matchStage = {
            date: { $lte : new Date() }
        };

        if(startDate){
            if(new Date(startDate) < new Date(endDate)){
                if(new Date(endDate) <= new Date()){
                    matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
                    console.log(matchStage.date);
                }
                else{
                    res.status(403).json({ message: "End date cannot be later than today's date" });
                }
            }
        }

        console.log(matchStage);
    const dailyActivityRevenue = await Bookings.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "activities", // Name of the activities collection
                localField: "activityID", // Field in bookings to match
                foreignField: "_id", // Field in activities to match
                as: "activityDetails" // Alias for the joined data
            }
        },
        {
            $unwind: "$activityDetails" // Unwind the joined activity details
        },
        {
            $group: {
                _id: {
                    creationDay: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date" // Group by the booking date
                        }
                    },
                    activityID: "$activityID"
                },
                totalPrice: { $sum: "$price" },
                activityName: { $first: "$activityDetails.name" }
            }
        },
        {
            $project: {
                _id: 0,
                title: "$activityName",
                type: "Activity",
                // productId: "$_id.activityID",
                date: "$_id.creationDay",
                revenue: { $multiply: ["$totalPrice", 0.1] } // Apply 90% revenue calculation
            }
        },
        {
            $sort: { Date: 1 } // Sort by date
        }
    ]);

    const dailyItenararyRevenue = await Bookings.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "itineraries", // Name of the itineraries collection
                localField: "itineraryID", // Field in bookings to match
                foreignField: "_id", // Field in itineraries to match
                as: "itineraryDetails" // Alias for the joined data
            }
        },
        {
            $unwind: "$itineraryDetails" // Unwind the joined itinerary details
        },
        {
            $group: {
                _id: {
                    creationDay: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date" // Group by the booking date
                        }
                    },
                    itineraryID: "$itineraryID"
                },
                totalPrice: { $sum: "$price" },
                itineraryName: { $first: "$itineraryDetails.name" }
            }
        },
        {
            $project: {
                _id: 0,
                title: "$itineraryName",
                type: "Itinerary",
                // productId: "$_id.itineraryID",
                date: "$_id.creationDay",
                revenue: { $multiply: ["$totalPrice", 0.1] } // Apply 90% revenue calculation
            }
        },
        {
            $sort: { Date: 1 } // Sort by date
        }
    ]);


    
    const newMatchStage = {
        orderDate: { $lte : new Date() },
    }
    if(startDate){
        if(new Date(startDate) < new Date(endDate)){
            if(new Date(endDate) <= new Date()){
                newMatchStage.orderDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
                console.log(newMatchStage.orderDate);
            }
        }
    }
    if(productIDs){
        newMatchStage['products.productID'] = { $in: productIDs };
    }
    console.log(newMatchStage);
            

    const dailyProductsRevenue = await Orders.aggregate([
        // Unwind the products array
        {
            $unwind: "$products"
        },
        {
            $match : newMatchStage
        },
        // Lookup product details from the products collection
        {
            $lookup: {
                from: "products", // Name of the products collection
                localField: "products.productID", // Field in orders to match
                foreignField: "_id", // Field in products to match
                as: "productDetails" // Alias for the joined data
            }
        },
        // Unwind the joined product details
        {
            $unwind: "$productDetails"
        },
        // Project the revenue calculation and retain necessary fields
        {
            $project: {
                _id: 0, // Keep the order ID
                orderDate: 1, // Keep the order date
                type: "Product", // Type of the product
                productName: "$productDetails.name", // Name of the product
                quantity: "$products.quantity", // Quantity of the product in the order
                revenue: { $multiply: ["$products.quantity", "$productDetails.price", 0.1] } // Revenue per product in the order
            }
        },
        // Optionally sort by orderDate
        {
            $sort: { orderDate: 1 }
        }
    ]);
    
    // console.log(salesAndRevenuePerOrder);
    

    const combinedRevenue = [...dailyProductsRevenue, ...dailyActivityRevenue, ...dailyItenararyRevenue];

    // Sort the combined array by the 'date' field
    combinedRevenue.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return res.status(200).json(combinedRevenue);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}