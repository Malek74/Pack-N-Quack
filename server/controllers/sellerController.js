
import Orders from "../models/orderSchema.js";
import product from "../models/productSchema.js";
import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../utils/Helpers.js';
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";
import { getUserRole } from "../utils/Helpers.js";
import mongoose from "mongoose";


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
    const productIDs = req.query.selectedProducts;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required." });
    }
    try{
        let productIds = (await product.find({ seller_id: sellerId }).select("_id")).map((product) => product._id);
        console.log(productIds);

        if (productIDs) {
            productIds = productIDs.split(",");
            console.log(productIDs);
        }

        // Prepare the match stage for the aggregation query
        const matchStage = {
            "products.productID": { $in: productIds.map(id => new mongoose.Types.ObjectId(id)) }
        };

        // Add date filtering to the match stage if startDate and endDate are provided
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

    const dailyRevenue = await Orders.aggregate([
        {
            $unwind: "$products" // Break down the `products` array
        },
        {
            $match: 
                matchStage
        },
        {
            $lookup: {
                from: "products", // Name of the products collection
                localField: "products.productID", // Field in orders to match
                foreignField: "_id", // Field in products to match
                as: "productDetails" // Alias for the joined data
            }
        },
        {
            $unwind: "$productDetails" // Unwind the joined product details
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
                    productID: "$products.productID"
                },
                totalPrice: {
                    $sum: {
                        $multiply: ["$products.quantity", "$productDetails.price"] // Calculate total revenue for each product
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                // productId: "$_id.productID",
                date: "$_id.creationDay",
                revenue: { $multiply: ["$totalPrice", 0.9] } // Apply 90% revenue calculation
            }
        },
        {
            $sort: { Date: 1 } // Sort by date
        }
    ]);

    // const totalRevenue = await Orders.aggregate([
    //     {
    //         $unwind: "$products" // Break down the `products` array
    //     },
    //     {
    //         $match: {
    //             matchStage
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "products", // Name of the products collection
    //             localField: "products.productID", // Field in orders to match
    //             foreignField: "_id", // Field in products to match
    //             as: "productDetails" // Alias for the joined data
    //         }
    //     },
    //     {
    //         $unwind: "$productDetails" // Unwind the joined product details
    //     },
    //     {
    //         $group: {
    //             _id: null, // Single group for total revenue
    //             totalPrice: {
    //                 $sum: {
    //                     $multiply: ["$products.quantity", "$productDetails.price"] // Calculate total revenue
    //                 }
    //             }
    //         }
    //     },
    //     {
    //         $project: {
    //             _id: 0,
    //             productsRevenue: { $multiply: ["$totalPrice", 0.9] } // Apply 90% revenue calculation
    //         }
    //     }
    // ]);

// const salesAndRevenuePerProduct = await Orders.aggregate([
//     // Unwind the products array
//     {
//         $unwind: "$products"
//     },
//     // Match products by productIds
//     {
//         $match: {
//             matchStage
//         }
//     },
//     // Lookup product details from the products collection
//     {
//         $lookup: {
//             from: "products", // Name of the products collection
//             localField: "products.productID", // Field in orders to match
//             foreignField: "_id", // Field in products to match
//             as: "productDetails" // Alias for the joined data
//         }
//     },
//     // Unwind the joined product details
//     {
//         $unwind: "$productDetails"
//     },
//     // Group by productID
//     // {
//     //     $group: {
//     //         _id: {
//     //             productID: "$products.productID",
//     //             date: "$orderDate"
//     //         },
//     //         totalSales: { $sum: "$products.quantity" }, // Total quantity sold
//     //         totalRevenue: { $sum: { $multiply: ["$products.quantity", "$productDetails.price"] } } // Revenue = quantity * price
//     //     }
//     // },
//     // Project the final result
//     {
//         $project: {
//             _id: 0,
//             productName: "$productDetails.name", // Replace `name` with the product's name field
//             productQuantity: "$products.quantity", // Replace `quantity` with the product's quantity field
//             revenue: {  $multiply: ["$products.quantity", "$productDetails.price", 0.9] }, // Apply 90% revenue calculation
//             // sales: "$totalSales"
//         }
//     }
// ]);

const totalRevenue = await Orders.aggregate([
    // Unwind the products array
    {
        $unwind: "$products"
    },
    // Match products by dynamic conditions
    {
        $match: matchStage // Ensure matchStage is correctly defined
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
    // Group by null to calculate total revenue
    {
        $group: {
            _id: null, // Single group for total revenue
            totalPrice: {
                $sum: {
                    $multiply: ["$products.quantity", "$productDetails.price"]
                }
            }
        }
    },
    // Project the final revenue with 90% calculation
    {
        $project: {
            _id: 0,
            productsRevenue: { $multiply: ["$totalPrice", 0.9] } // Apply 90% revenue calculation
        }
    }
]);


const salesAndRevenuePerProduct = await Orders.aggregate([
    // Unwind the products array
    {
        $unwind: "$products"
    },
    // Match products by dynamic conditions
    {
        $match: matchStage // Ensure `matchStage` is defined outside the pipeline
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
    // Project the final result
    {
        $project: {
            _id: 0,
            productName: "$productDetails.name", // Name of the product
            price: { $multiply: ["$products.quantity", "$productDetails.price", 0.9] }, // Revenue with 90% calculation
            quantity: "$products.quantity", // Include quantity for each product
            orderDate: "$orderDate" // Optionally include the order date
        }
    }
]);



    console.log({
        dailyRevenue,
        totalRevenue: totalRevenue[0]?.activitiesRevenue,
        salesAndRevenuePerProduct 
    });

    return res.status(200).json({
        revenuePerDay: dailyRevenue,
        totalRevenue: totalRevenue[0]?.productsRevenue || 0,
        salesAndRevenuePerProduct
    });
    }catch(error){
        return res.status(400).json({ message: error.message });
    }

    
}

