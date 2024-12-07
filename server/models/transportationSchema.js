import mongoose from "mongoose";
import Stripe from "stripe";

const transportationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    advertiserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Advertiser",
        required: true
    },
    type: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    stripeID: {
        type: String,
        required: false
    }
});

const Transportation = mongoose.model("Transportation", transportationSchema);

export default Transportation;