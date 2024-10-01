import { Schema, model } from "mongoose";

const advertiserSchema = new Schema({
    company_name: {
        type: String,
        default: ""
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
        default: ""
    },
    hotline: {
        type: Number,
        default: 0
    },
    establishment_date: {
        type: Date,
        default: new Date()
    },
    description: {
        type: String,
        default: ""
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
});

const advertiser = model("Advertiser", advertiserSchema);

export default advertiser;