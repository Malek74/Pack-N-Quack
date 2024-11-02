import { Schema, model } from "mongoose";

const advertiserSchema = new Schema({
    companyName: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: "male"
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
    establishmentDate: {
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

const advertiserModel = model("Advertiser", advertiserSchema);

export default advertiserModel;