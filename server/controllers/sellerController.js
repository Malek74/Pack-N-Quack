
import Orders from "../models/orderSchema.js";
import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../utils/Helpers.js';


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

        const newSeller = await seller.create({ email, username, password });
        return res.status(200).json(newSeller);

    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

//read using ID
export const getSellerByID = async (req, res) => {
    const id = req.params.id;
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
    const id = req.params.id;
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
    const sellerId = req.params.id;
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
                    // productID: "$products.productID" // Group by the product ID
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
        totalRevenue: totalRevenue[0]?.activitiesRevenue || 0
    });

    return res.status(200).json({
        dailyRevenue,
        totalRevenue: totalRevenue[0]?.activitiesRevenue || 0
    });
    
}

