import mongoose from "mongoose";
import { Schema } from "mongoose";

const placesSchema = new Schema({
    touristGovenorID: {
        type: Schema.Types.ObjectId,
        ref: "TouristGoverner",
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    pictures: {
        type: [String], // Array of strings for URLs or paths to pictures
        default: ["/images/Memo.png", "/images/Lege-cy.jpg", "/images/Pyramids.jpeg"]
    },
    coverImagePath: {
        type: String,
        required: true,
        default: "/images/Memo.png"
    },
    location: {
        type: String,
        required: true,
    },
    googleMapLink: {
        type: String,
        required: true,
    },
    opening_hour: [{
        day: {
            type: String,
            required: true
        },
        openTime: {
            type: String,
        },
        closeTime: {
            type: String,
        },
        isOpen: {
            type: Boolean,
            required: true
        }
    }],
    tickets: [{
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        }
    }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }], // Reference to Tag schema
});

const Places = mongoose.model("Places", placesSchema);

export default Places;
