
import Orders from "../models/orderSchema.js";
import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../utils/Helpers.js';
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";
import { getUserRole } from "../utils/Helpers.js";


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

export const getRevenue = async (req, res) => {
    const sellerId = req.params.id;
    const role = getUserRole(req);
    if (role === "Selller"){
        query
    }
    const productIds = await product.find({ adminSellerID: sellerId }).select("_id");
    console.log(productIds);
    const dailyRevenue = await Orders.aggregate([
        {
            $unwind: "$products" // Break down the `products` array
        },
        {
            $match: {
                "products.productID": { $in: productIds } // Match products sold by the seller
            }
        },
        {
            $group: {
                _id: {
                    creationDay: {
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$orderDate" // Group by the order date
                        }
                    },
                },
                totalPrice: { $sum: { $multiply: ["$products.quantity", "$products.price"] } } // Calculate total price
            }
        },
        {
            $project: {
                _id: 0,
                // productId: "$_id.productID",
                Date: "$_id.creationDay",
                activitiesRevenue: { $multiply: ["$totalPrice", 0.9] } // Apply 90% revenue calculation
            }
        },
        {
            $sort: { Date: 1 } // Sort by date
        }
    ]);

    const totalRevenue = await Orders.aggregate([
        {
            $unwind: "$products" // Break down the `products` array
        },
        {
            $match: {
                "products.productID": { $in: productIds } // Match products sold by the seller
            }
        },
        {
            $group: {
                _id: null, // Single group for total revenue
                totalPrice: { $sum: { $multiply: ["$products.quantity", "$products.price"] } } // Sum total prices
            }
        },
        {
            $project: {
                _id: 0,
                activitiesRevenue: { $multiply: ["$totalPrice", 0.9] } // Apply 90% revenue calculation
            }
        }
    ]);

    console.log({
        dailyRevenue,
        totalRevenue: totalRevenue[0]?.activitiesRevenue 
    });

    return res.status(200).json({
        dailyRevenue,
        totalRevenue: totalRevenue[0]?.activitiesRevenue
    });
    
}

