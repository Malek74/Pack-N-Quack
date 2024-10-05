import { Schema, model } from "mongoose";

const activitySchema = new Schema({
    advertiserID: {
        type: Schema.Types.ObjectId,
        ref: 'Advertiser', // Reference the Advertiser model
        required: true,
    },

    categoryID: {
        type: Schema.Types.ObjectId,
        ref: 'ActivityCategory', // Reference the ActivityCategory model
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

    googleMapLink: {
        type: String,
        required: true
    },
    priceType: {
        type: String,
        enum: ['fixed', 'range'],
        required: true

    },
    price: {
        type: Number,
    },
    minPrice: {
        type: Number,
    },
    maxPrice: {
        type: Number,
    },

    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'ActivityTag',
        }],
        default: [],
        required: true
    },
    ratings: {
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        reviews: {
            type: [{
                touristID: {
                    type: Schema.Types.ObjectId,
                    ref: 'Tourist',
                    required: true
                },
                rating: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                },
                comment: {
                    type: String,
                    default: ''
                },
                date: {
                    type: Date,
                    default: Date.now
                }
            }],
            default: []
        }
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

    name: {
        type: String,
        required: true
    },
})

const activityModel = model("Activity", activitySchema);
export default activityModel
