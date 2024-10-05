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
            duration: {
                startTime: {
                    type: Date
                },
                endTime: {
                    type: Date,
                },
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
            userID: {
                type: Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            review: {
                type: String,
                default: '' // Optional text review
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

    tags:
        [
            {
                type: Schema.Types.ObjectId,
                ref: 'itineraryTags'
            }
        ]
    ,

    subscribers: [{
        type: [Schema.Types.ObjectId],
        ref: 'Tourist'
    }],

    accessibility: {
        type: [String],
        required: true
    }

});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;


