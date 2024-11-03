import Tourist from "../models/touristSchema.js";
import product from "../models/productSchema.js"; // Ensure this matches your model name
import PurchasedItem from "../models/purchasedSchema.js";

export const buyItem = async (req, res) => {
    const { productId, userId } = req.body;

    try {
        // Check if the product exists
        const productExist = await product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        // Check if the user exists
        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        
        const updatedPurchase = await PurchasedItem.findOneAndUpdate(
            { user: userId },
            {  items: productId  }, // Add new products without duplicates
            { new: true });

        return res.status(200).json(updatedPurchase);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
