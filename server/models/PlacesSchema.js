import mongoose from "mongoose";
import { Schema } from "mongoose";

const placesSchema = new Schema({
    description: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String], // Array of strings for URLs or paths to pictures
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    opening_hour: {
        type: String, // Can change to Date if specific times are needed
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
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }], // Reference to Tag schema
});

const Places = mongoose.model("Places", placesSchema);

export default Places;
