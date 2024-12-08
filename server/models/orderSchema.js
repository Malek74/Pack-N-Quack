import { Schema, model } from "mongoose";
import tourist from "./touristSchema";

const orderSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: tourist,
        required: true
    },
    productIDs: {
        type: [Schema.Types.ObjectId],
        ref: 'product',
        required: true
    },
    sellerIDs: {
        type: [Schema.Types.ObjectId],
        ref: 'seller',
        required: true
    },
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
        required: true
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