
import Orders from "../models/orderSchema.js";
import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../utils/Helpers.js';
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";


//get all sellers
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await seller.find();
        res.status(200).json(sellers)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//@desc create seller
//@route
export const createSeller = async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Please fill all fields" });
    }

    try {
        //check user name is unique across all users
        if (await usernameExists(username)) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const salt = await bcrypt.genSalt(); //generate salt to randomise the password hash (distinct between users with the same password)
        const hashedPassword = await bcrypt.hash(password, salt);

        const newSeller = await seller.create({ email, username, password: hashedPassword });

        //create a token for the user
        const token = createToken(username, newSeller._id, "Seller");

        //send the token in the response
        res.cookie("jwt", token, { httpOnly: true });

        return res.status(200).json(newSeller);

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

//read using ID
export const getSellerByID = async (req, res) => {
    const id = req.user._id;
    if (!id) {
        return res.status(400).json({ message: "Please provide a Seller ID" });
    }
    try {
        const sellerFetched = await seller.findById(id);
        return res.status(200).json(sellerFetched)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

//update by ID
export const updateSellerInfo = async (req, res) => {
    const id = req.user._id;
    const { email, oldEmail, username, password, name, description, isAccepted } = req.body;

    const oldSeller = await seller.findById(id);
    if (!oldSeller) {
        return res.status(404).json({ message: "Seller not found" });
    }

    if (email != oldEmail) {
        const doesEmailExists = await emailExists(email);
        if (doesEmailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
    }
    try {
        const newInfo = {};
        if (email) newInfo.email = email;
        if (username) newInfo.username = username;
        if (password) newInfo.password = password;
        if (name) newInfo.name = name;
        if (description) newInfo.description = description;
        if (isAccepted) newInfo.isAccepted = isAccepted;

        const newSeller = await seller.findByIdAndUpdate(id, { $set: newInfo }, { new: true });
        res.status(200).json(newSeller);

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}
//TODO: Add cascade deleting for items that belong to the seller
//delete by ID
export const deleteSeller = async (req, res) => {

}

export const acceptTerms = async (req, res) => {
    const sellerId = req.user._id;
    if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required." });
    }
    try {
        const updatedSeller = await seller.findById(sellerId);
        if (!updatedSeller) {
            return res.status(404).json({ message: "Seller not found." });
        }
        const newSeller = await seller.findByIdAndUpdate(sellerId, { hasAcceptedTerms: true }, { new: true })
        return res.status(200).json(newSeller);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getBookingCount = async (req, res) => {
    const id = req.params.id;
    const  startDate = req.query.startDate;
    const  endDate = req.query.endDate || new Date();
    const productId = req.query.productId;

    if(!id) {
        return res.status(400).json({ message: "Seller ID is required." });
    }

    if (startDate && !Date.parse(startDate)) {
        return res.status(400).json({ message: "Invalid start date." });
    }

    if(endDate && !Date.parse(endDate)) {
        return res.status(400).json({ message: "Invalid end date." });
    }

    if(productId && !mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ message: "Invalid product ID." });
    }



    try {

        if(productId && !(await activityModel.findById(productId))){
            return res.status(400).json({ message: "Product not found." });
        }

        if(!await seller.findById(id)) {
            return res.status(400).json({ message: "Seller not found." });
        }
    
        // let productIds = (await activityModel.find({ advertiserID: id, date: { $lte: new Date() } })).map(activity => activity._id.toString());

        let activityQuery = { 
            sellerID: id, 
            orderDate: { $lte: new Date() } 
        };

        // If a specific activity is provided, add it to the activity query
        // if (productId) {
        //     productIds = [productId];
        // }


        // Prepare the match stage for bookings
        // const matchStage = {
        //     productId: { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) }
        // };

        // Add date filtering if a specific date is provided
        if (startDate && endDate) {
            matchStage.orderDate = {
                $gte: new Date(startDate),
                $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
            };
        }

        // console.log(matchStage);    

        // const bookings = await Order.find().select('_id product orderDate');

        const revenuePerDay = await Orders.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: {
                        creationDay: { $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date"
                        } }
                    },
                    count: { $sum: 1 },
                    totalPrice: { $sum: "$price" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    Date: "$_id.creationDay",
                    revenue: { $multiply: ["$totalPrice", 0.9] }
                }
            },
            {
                $sort: { creationDay: 1 }
            }
        ]);

        const totalRevenue = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: null, 
                    totalPrice: { $sum: "$price" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    activitiesRevenue: { $multiply: ["$totalPrice", 0.9] }
                }
            },
        ]);

        const totalBookings = await Booking.countDocuments(matchStage);

        const revenueAndBookingsPerEvent = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: {
                        activityID: "$activityID",
                    },
                    count: { $sum: 1 },
                    totalPrice: { $sum: "$price" } 
                }
            },
            {
                $lookup: {
                    from: 'activities',
                    localField: '_id.activityID',
                    foreignField: '_id',
                    as: 'activityDetails'
                }
            },
            {
                $unwind: '$activityDetails' // Deconstructs the array created by $lookup
            },
            {
                $project: {
                    _id: 0,
                    title: '$activityDetails.name',
                    revenue: { $multiply: ["$totalPrice", 0.9] }, 
                    bookings: "$count"
                }
            },
            {
                $sort: { creationDay: 1 }
            }
        ]);

        res.status(200).json({revenuePerDay: revenuePerDay, totalRevenue: totalRevenue[0], totalBookings: {activitiesBookings: totalBookings}, revenueAndBookingsPerEvent: revenueAndBookingsPerEvent});
    
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
