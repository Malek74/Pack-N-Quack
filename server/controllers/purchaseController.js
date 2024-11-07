import Tourist from "../models/touristSchema.js";
import Product from "../models/productSchema.js";
import PurchasedItem from "../models/purchasedSchema.js";
import Stripe from "stripe";

export const buyItem = async (req, res) => {
    const { productId, userId } = req.body;

    try {

        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const stripeProduct = stripe.products.retrieve(productExist.stripeID);

        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        if (productExist.available_quantity <= 0) {
            return res.status(400).json({ message: "Product is out of stock" });
        }

        const purchaseRecord = await PurchasedItem.findOneAndUpdate(
            { user: userId, "items.productId": productId },
            { $inc: { "items.$.boughtNtimes": 1 } },
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
                            review: null
                        }
                    }
                },
                { new: true, upsert: true }
            );
            //create a stripe session 

            return res.status(201).json(newPurchaseRecord);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const rateProduct = async (req, res) => {
    const { userId, productId, rating, review } = req.body;
    console.log(req.body);
    try {

        //check that product exists
        const productExist = await Product.findById(productId);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        //check that user exists
        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        //check that user has purchased the product
        const purchaseRecord = await PurchasedItem.findOne({ user: userId, "items.productId": productId });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot rate it" });
        }

        //check that rating is between 0 and 5
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }

        //update the rating and review
        const updatedRecord = await PurchasedItem.findOneAndUpdate(
            { user: userId, "items.productId": productId },
            { $set: { "items.$.rating": rating, "items.$.review": review } },
            { new: true }
        );
        console.log(updatedRecord);
        return res.status(200).json(updatedRecord);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const ReviewProduct = async (req, res) => {
    const { userId, productId, review } = req.body;
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
