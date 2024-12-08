import Tourist from "../models/touristSchema.js";
import Product from "../models/productSchema.js";
import PurchasedItem from "../models/purchasedSchema.js";
import Stripe from "stripe";

export const buyItem = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user._id;

    try {
        
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        
        if (productExist.available_quantity <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        
        let purchaseRecord = await PurchasedItem.findOneAndUpdate(
            { user: userId, "items.productId": productId },
            { $inc: { "items.$.boughtNtimes": 1 },
            $set: { "items.$.status": "out for shipment" } },
            { new: true }
        );

        
        await Product.findByIdAndUpdate(
            productId,
            {
                $inc: { product_sales: 1, available_quantity: -1 }
            },
            { new: true }
        );

      
        if (purchaseRecord) {
            return res.status(200).json(purchaseRecord);
        } else {
            
            const newPurchaseRecord = await PurchasedItem.findOneAndUpdate(
                { user: userId },
                {
                    $push: {
                        items: {
                            productId: productId,
                            boughtNtimes: 1,
                            rating: null,
                            review: null,
                            status: "out for shipment" 
                        }
                    },
                    
                },
                { new: true, upsert: true }
            );
            return res.status(201).json(newPurchaseRecord);
        }
    } catch (error) {
        console.error("Error in buyItem controller:", error);
        return res.status(500).json({ message: error.message });
    }
};


export const rateProduct = async (req, res) => {
    const userId = req.user._id;
    const { productId, rating } = req.body;

    try {
        // Check if the product exists
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        // Check if the user exists
        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Check if the user has purchased the product
        const purchaseRecord = await PurchasedItem.findOne({ user: userId, "items.productId": productId });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot rate it" });
        }

        // Validate the rating
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }

        // Check the status of the specific purchased item
        let item = purchaseRecord.items.find(item => item.productId.toString() === productId.toString());
        if (item && item.status === "out for shipment") {
            return res.status(400).json({ message: "You cannot rate a product that you haven't yet received" });
        }

        // Update the rating for the specific product in the user's purchase record
        const updatedRecord = await PurchasedItem.findOneAndUpdate(
            { user: userId, "items.productId": productId },
            { $set: { "items.$.rating": rating } }, // Only updating the rating field
            { new: true }
        );

        // Calculate the new average rating for the product
        const newAverageRating =
            ((productExist.ratings.averageRating * productExist.ratings.reviews.length) + rating) /
            (1 + productExist.ratings.reviews.length);

        // Update the product's rating and add a simple rating record (no review)
        await Product.findByIdAndUpdate(
            productId,
            {
                $set: { "ratings.averageRating": newAverageRating },
                $push: { "ratings.reviews": { touristID: userId, rating: rating } }
            },
            { new: true }
        );

        return res.status(200).json(updatedRecord);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const ReviewProduct = async (req, res) => {
    const userId = req.user._id;
    const {  productId, review } = req.body;
    console.log(req.body);
    try {

        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const purchaseRecord = await PurchasedItem.findOne({ user: userId, "items.productId": productId });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot review it" });
        }

        let item = purchaseRecord.items.find(item => item.productId.toString() === productId.toString());

        if (item && item.status === "out for shipment") {
            return res.status(400).json({ message: "You cannot review a product that you haven't yet received" });
        }

        const updatedRecord = await PurchasedItem.findOneAndUpdate(
            { user: userId, "items.productId": productId },
            { $set: { "items.$.review": review } },
            { new: true }
        );
        console.log(updatedRecord);
        return res.status(200).json(updatedRecord);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const viewPurchasedItems = async (req, res) => {
    const userId = req.user._id; 
    try {
        const purchaseRecord = await PurchasedItem.findOne({ user: userId });

        if (!purchaseRecord) {
            return res.status(404).json({ message: "No purchased items found for this user." });
        }
        const purchasedItems = purchaseRecord.items;
        return res.status(200).json({
            purchasedItems
        });
    } catch (error) {
        console.error("Error retrieving purchased items:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    try {
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        const purchaseRecord = await PurchasedItem.findOne({ user: userId, "items.productId": productId });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot cancel the order" });
        }

        let item = purchaseRecord.items.find(item => item.productId.toString() === productId.toString());

        if (item && item.status === "out for shipment") {
            if (item.boughtNtimes > 1) {
                item.boughtNtimes--;
                item.status = "complete";

                await Product.findByIdAndUpdate(
                    productId,
                    {
                        $inc: { product_sales: -1, available_quantity: 1 }
                    },
                    { new: true }
                );

                await purchaseRecord.save();

                return res.status(200).json({ message: "Order has been cancelled" });
            } else {

                purchaseRecord.items = purchaseRecord.items.filter(item => item.productId.toString() !== productId.toString());


                if (purchaseRecord.items.length === 0) {
                    await PurchasedItem.findByIdAndDelete(purchaseRecord._id);
                } else {

                    await purchaseRecord.save();
                }

                await Product.findByIdAndUpdate(
                    productId,
                    {
                        $inc: { product_sales: -1, available_quantity: 1 }
                    },
                    { new: true }
                );

                return res.status(200).json({ message: "Order has been cancelled and item removed from purchase history" });
            }
        } else {
            return res.status(400).json({ message: "The order cannot be canceled as it is not out for shipment" });
        }
    } catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ message: error.message });
    }
};


