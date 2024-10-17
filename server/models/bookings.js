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
    date: {
        type: Date,
        required: true
    },
    numOfBookings: {
        type: Number,
        required: true
    },
    stripePaymentID: {
        type: String,
    },
    stripeSessionID: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        required: true
    }
}, { timestamps: true });

const Booking = model("Booking", bookingSchema);
