import Tourist from "../models/touristSchema.js";
import Product from "../models/productSchema.js";
import PurchasedItem from "../models/purchasedSchema.js";
import Stripe from "stripe";
import Order from "../models/orderSchema.js"
import { getConversionRate } from "../utils/Helpers.js";

export const rateProduct = async (req, res) => {
    const touristID = req.user._id;
    const { productID, rating } = req.body;

    try {
        // Check if the product exists
        const productExist = await Product.findById(productID);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        // Check if the user exists
        const userExist = await Tourist.findById(touristID);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Check if the user has purchased the product
        const purchaseRecord = await Order.findOne({ touristID: touristID, "products.productID": productID });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot rate it" });
        }

        // Validate the rating
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 0 and 5" });
        }

        // Check the status of the specific purchased item
        let item = purchaseRecord.products.find(item => item.productID.toString() === productID.toString());
        if (item && item.orderStatus === "Pending") {
            return res.status(400).json({ message: "You cannot rate a product that you haven't yet received" });
        }

        // Update the rating for the specific product in the user's purchase record
        const updatedRecord = await Order.findOneAndUpdate(
            { touristID: touristID, "products.productID": productID },
            { $set: { "products.$.rating": rating } }, // Only updating the rating field
            { new: true }
        );

        // Calculate the new average rating for the product
        const newAverageRating =
            ((productExist.ratings.averageRating * productExist.ratings.reviews.length) + rating) /
            (1 + productExist.ratings.reviews.length);

        // Update the product's rating and add a simple rating record (no review)
        await Product.findByIdAndUpdate(
            productID,
            {
                $set: { "ratings.averageRating": newAverageRating },
                $push: { "ratings.reviews": { touristID: touristID, rating: rating } }
            },
            { new: true }
        );

        return res.status(200).json(updatedRecord);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const ReviewProduct = async (req, res) => {
    const touristID = req.user._id;
    const { productID, review } = req.body;
    console.log(req.body);
    try {

        const productExist = await Product.findById(productID);
        if (!productExist) {
            return res.status(404).json({ message: "Product doesn't exist" });
        }

        const userExist = await Tourist.findById(touristID);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        const purchaseRecord = await Order.findOne({ touristID: touristID, "products.productID": productID });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "You have not purchased this product, so you cannot review it" });
        }

        let item = purchaseRecord.products.find(item => item.productID.toString() === productID.toString());

        if (item && item.orderStatus === "Pending") {
            return res.status(400).json({ message: "You cannot review a product that you haven't yet received" });
        }

        const updatedRecord = await Order.findOneAndUpdate(
            { touristID: touristID, "products.productID": productID },
            { $set: { "products.$.review": review } },
            { new: true }
        );
        console.log(updatedRecord);
        return res.status(200).json(updatedRecord);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const viewAllOrderDetails = async (req, res) => {
    const touristID = req.user._id;
    const status = req.query.status;
    const prefCurrency = req.query.currency;
    let orderDetails;
    try {
        const conversionRate = await getConversionRate(prefCurrency);
        //orders delivered or cancelled 
        if (status == "old") {
            orderDetails = await Order.find({ touristID: touristID, orderStatus: { $in: ["Delivered", "Cancelled"] } });
        }
        if (status == "all") {
            orderDetails = await Order.find({ touristID: touristID });
        }
        if (status == "pending") {
            orderDetails = await Order.findOne({ touristID: touristID, orderStatus: "Out for Delivery" });
        }

        if (!orderDetails) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        if (orderDetails.length > 0) {
            orderDetails.products.forEach((product) => {
                product.price = product.price * conversionRate;
            });
        }
        return res.status(200).json(orderDetails);
    } catch (error) {
        console.error("Error retrieving order details:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const viewSingleOrderDetails = async (req, res) => {
    const touristID = req.user._id;
    const orderID = req.params.id;
    const prefCurrency = req.query.currency;

    try {
        const conversionRate = await getConversionRate(prefCurrency);

        const orderDetails = await Order.findOne({ touristID: touristID, _id: orderID });

        if (!orderDetails) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        orderDetails.products.forEach((product) => {
            product.price = product.price * conversionRate;
        });

        return res.status(200).json(orderDetails);
    } catch (error) {
        console.error("Error retrieving order details:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const viewPendingOrderDetails = async (req, res) => {
    const touristID = req.user._id;

    try {
        // Find orders for the user with "Pending" status
        const pendingOrder = await Order.findOne({ touristID: touristID, orderStatus: "Pending" });

        if (!pendingOrder) {
            return res.status(404).json({ message: "No pending orders found for this user." });
        }

        return res.status(200).json(pendingOrder);
    } catch (error) {
        console.error("Error retrieving pending order details:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const cancelOrder = async (req, res) => {
    const touristID = req.user._id;
    const orderID = req.params.id;

    try {

        const purchaseRecord = await Order.findOne({ touristID: touristID, _id: orderID });
        if (!purchaseRecord) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Check if the order is eligible for cancellation
        if (purchaseRecord.orderStatus !== "Out for Delivery") {
            return res.status(400).json({ message: "Order is not eligible for cancellation." });
        }

        // Process each product in the order
        for (const item of purchaseRecord.products) {
            const productID = item.productID;
            const quantity = item.quantity;

            // Increase the stock of the product
            await Product.findByIdAndUpdate(productID, { $inc: { available_quantity: quantity } });
        }

        await Order.findByIdAndUpdate(orderID, { orderStatus: "Cancelled" });

        //update tourist wallet
        const refundAmount = purchaseRecord.orderTotal;
        const updatedTourist = await Tourist.findOneAndUpdate(
            { _id: touristID },
            { $inc: { wallet: refundAmount } },
            { new: true }
        );

        return res.status(200).json({ message: "Order has been cancelled successfully." });
    } catch (error) {
        console.error("Error canceling order:", error);
        return res.status(500).json({ message: error.message });
    }
};






