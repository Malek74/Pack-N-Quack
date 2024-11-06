import { Schema, model } from "mongoose";
import tourist from "./touristSchema.js";


const amadeusBookingSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true,
    },
    hotelData: {
        hotel: { type: String, required: true },
        type: { type: String, required: true },
        beds: { type: Number, required: true },
        bedType: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true }
    },

    flightData: {
        flight: { type: String, required: true },
        departure: { type: String, required: true },
        arrival: { type: String, required: true },
        price: { type: Number, required: true }
    },
    stripeSessionID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

})

const AmadeusBooking = model("AmadeusBooking", amadeusBookingSchema);

export default AmadeusBooking;