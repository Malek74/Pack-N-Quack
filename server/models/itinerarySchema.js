// --Itinerary
// activities
// locations to be visited
// timeline
// duration of each Activity
// language of tour
// price of tour
// available dates
// accesibility
// pickup drop off locations

import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const itinerarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    tourGuideID: {
        type: Schema.Types.ObjectId,
        ref: 'TourGuide', // Reference the tourguide model
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    //covers the days and activities of the itinerary 
    days: [{
        day: {
            type: Number,
            required: true,
        },
        activities: [{
            name: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            googleMapLink: {
                type: String,
                required: false
            },
            duration: {
                startTime: {
                    type: String
                },
                endTime: {
                    type: String,
                },
            },

            description: {
                type: String,
                default: ''
            },
            image: {
                type: String,
                required: false
            }
        }],
    }],

    language: {
        type: String,
        required: true
    },


    ratings: {
        averageRating: {
            type: Number,
            default: 0, // Default to 0 for activities with no ratings
            min: 0,
            max: 5
        },
        reviews: [{
            touristId: {
                type: Schema.Types.ObjectId,
                ref: 'Tourist', // Reference to the User model
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
                required: false,
                default: ''
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    price: {
        type: Number,
        required: true
    },
    available_dates: {
        type: [Date],
        required: true
    },
    pickUpLocation: {
        name: {
            type: String,
            required: true
        },
        googleMapLink: {
            type: String,
            required: true
        }
    },

    dropOffLocation: {
        name: {
            type: String,
            required: true
        },
        googleMapLink: {
            type: String,
            required: true
        }
    },

    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'itineraryTags'
        }],
        default: []
    },
    stripeID: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: false
    },



    accessibility: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    flagged: {
        type: Boolean,
        default: false,
    },
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;


