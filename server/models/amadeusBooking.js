import { Schema, model } from "mongoose";
import tourist from "./touristSchema.js";


const amadeusBookingSchema = new Schema({
    touristID: {
        type: Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true,
    },
    hotelData: {

        hotel: { type: String, required: false },
        type: { type: String, required: false },
        beds: { type: Number, required: false },
        bedType: { type: String, required: false },
        description: { type: String, required: false },
        price: { type: Number, required: false },
    },

    flightData: {
        flight: { type: String, required: false },
        departure: { type: String, required: false },
        arrival: { type: String, required: false },
        price: { type: Number, required: false },
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