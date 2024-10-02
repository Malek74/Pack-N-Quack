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


const itineraryActivity = new mongoose.Schema({
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
        }
    },
});
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

    //covers the activities, duration & locations  
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

    language: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 0
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
                ref: 'ItineraryTag'
            }
        ]
    ,

    accessibility: {
        type: [String],
        required: true
    }



});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;

