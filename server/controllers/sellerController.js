import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../controllers/Helpers.js';


export const createSeller = async (req, res) => {
    const { email, username, password} = req.body; 

    try {
        // Check if the email or username is already taken by any user
        const isEmailOrUsernameTaken = await Promise.all([
            Tourist.findOne({ $or: [{ email }, { username }] }),
            TourGuide.findOne({ $or: [{ email }, { username }] }),
            TouristGovernor.findOne({ username }),
            Seller.findOne({ $or: [{ email }, { username }] }),
            Admin.findOne( { username }),
            Advertiser.findOne({ $or: [{ email }, { username }] }),
        ]);
      
  

        if (isEmailOrUsernameTaken.some(user => user)) {
            return res.status(400).json({ message: "Email or username already taken." });
        }

        const newseller = await Seller.create({ email, username, password});
        res.status(200).json(newseller);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//get all sellers
export const getAllSellers = async (req, res) => {
    try {
        const sellers = await seller.find();
        res.status(200).json(sellers)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//create
export const createSeller = async (req, res) => {
    const { email, username, password, name, description } = req.body;
    if (!email || !username || !password || !name || !description) {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    try {
        //check user name is unique across all users
        if (await usernameExists(username)) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newSeller = await seller.create({ email, username, password, name, description });
        return res.status(200).json(newSeller);

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//read using ID
export const getSellerByID = async (req, res) => {
    const { id } = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Please provide a Seller ID" });
    }
    try {
        const seller = await seller.findOne({ email });
        res.status(200).json(seller)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
    res.status(200).json(newSeller);
}

//update by ID
export const updateSellerInfo = async (req, res) => {
    const id = req.params.id;
    const { email, username, password, name, description, isAccepted } = req.body;

    const oldSeller = await seller.findById(id);
    if (!oldSeller) {
        return res.status(404).json({ message: "Seller not found" });
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
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Please provide a Seller ID" });
    }
    try {
        const deletedSeller = await seller.findByIdAndDelete(id);
        await deleteProducts(id);


        res.status(200).json({ message: `Seller with id ${id} deleted successfully` })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}


