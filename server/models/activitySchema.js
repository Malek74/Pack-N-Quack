import { Schema, model } from "mongoose";

const activitySchema = new Schema({
    advertiserID: {
        type: Schema.Types.ObjectId,
        ref: 'Advertiser', // Reference the Advertiser model
        required: true,
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    priceType: {
        type: String,
        enum: ['fixed', 'range'],
        required: true
    }, price: {
        type: Number,
        required: true
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: [],
        required: true
    },
    specialDiscounts: {
        type: [String],
        default: [],
        required: true
    },
    isBookingOpen: {
        type: Boolean,
        default: false,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
})

const activity = model("Activity", activitySchema);
export default activity