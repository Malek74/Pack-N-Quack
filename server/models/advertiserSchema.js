import { Schema, model } from "mongoose";

const advertiserSchema = new Schema({
    company_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    website: {
        type: String,
    },
    hotline: {
        type: Number,
    },
    establishment_date: {
        type: Date,
    },
    description: {
        type: String,
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
});

const advertiser = model("Advertiser", advertiserSchema);

export default advertiser;