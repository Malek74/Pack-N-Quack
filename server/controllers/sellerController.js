import seller from "../models/sellerSchema.js";
import { usernameExists, deleteProducts, deleteActivities, refundMoney } from '../controllers/Helpers.js';

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


