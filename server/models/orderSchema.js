import { Schema, model } from "mongoose";
// import product from "./productSchema";
// import Tourist from "./touristSchema";

const orderSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    products: [{
        productID: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    stripeSessionID: {
        type: String,
        default: null,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending"
    },
    orderTotal: {
        type: Number,
        required: true
    },
    deliveryDate: {
        type: Date,
        required: false
    },
    paidByWallet:{
        type: Number,
        default: 0,
        required: true
    },
    paidByCard:{
        type: Number,
        default: 0,
        required: true
    },
},{timestamps: true});

const Order = model("Order", orderSchema);

export default Order;