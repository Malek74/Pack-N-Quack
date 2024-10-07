import { Schema, model } from "mongoose";

const touristSchema = new Schema({
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
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        default: ''
    },
    wallet: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const tourist = model("Tourist", touristSchema);
export default tourist;