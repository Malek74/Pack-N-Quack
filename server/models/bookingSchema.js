import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist', // Reference the Tourist model
        required: true,
    },
    itineraryID: {
        type: Schema.Types.ObjectId,
        ref: 'Itinerary', // Reference the Itinerary model
    },
    activityID: {
        type: Schema.Types.ObjectId,
        ref: 'Activity', // Reference the Activity model
    },
    transportationID: {
        type: Schema.Types.ObjectId,
        ref: 'Transportation', // Reference the Transportation model
    },
    date: {
        type: Date,
        default: Date.now

    },
    price: {
        type: Number,
        required: true
    },
    stripeSessionID: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Booking = model("Booking", bookingSchema);

export default Booking;