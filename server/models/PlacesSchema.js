import mongoose from "mongoose";
import { Schema } from "mongoose";

const placesSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String], // Array of strings for URLs or paths to pictures & see if we want to change it 
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    opening_hour: {
        type: String, // we can use Date to specify time with a date format
        required: true,
    },
    ticket_price_native: {
        type: Number, 
        required: true,
    },
    ticket_price_foreigner: {
        type: Number, 
        required: true,
    },
    ticket_price_student: {
        type: Number, 
        required: true,
    },
});

const Places = mongoose.model("Places", placesSchema);

export default Places;
