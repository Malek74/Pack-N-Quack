import mongoose from "mongoose";

const flightBookingsSchema = new mongoose.Schema({
    flightID: {
        type: String,
        required: true
    }
});