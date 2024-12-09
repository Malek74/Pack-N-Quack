import { Schema, model } from "mongoose";
// import product from "./productSchema";
// import Tourist from "./touristSchema";

const orderSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    products:
    {
        type: [{
            productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            rating: { type: Number },
            review: { type: String },
        }]
    },
    stripeSessionID: {
        type: String,
        default: null,
        required: false
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ["Cancelled", "Out for Delivery", "Delivered"],
        default: "Out for Delivery"
    },
    orderTotal: {
        type: Number,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: false
    },
    paidByWallet: {
        type: Number,
        default: 0,
        required: true
    },
    paidByCard: {
        type: Number,
        default: 0,
        required: false
    },
    deliveryAddress: {
        type: Object,
        required: false
    },
},{timestamps: true});

const Order = model("Order", orderSchema);
export default Order;