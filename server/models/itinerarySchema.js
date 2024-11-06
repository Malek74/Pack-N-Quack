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
        type: String,
        required: true
    },

    dropOffLocation: {
        type: String,
        required: true
    },
    bookings: {
        type: Number,
        default: 0
    },
    tags: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'itineraryTags'
        }],
        default: []
    },
    subscribers: [{
        type: [Schema.Types.ObjectId],
        ref: 'Tourist'
    }],
    accessibility: {
        type: String,
        required: true
    }
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;


