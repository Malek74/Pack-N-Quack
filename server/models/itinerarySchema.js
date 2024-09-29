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
import activities from './activitiesSchema.js';

const itinerarySchema = new mongoose.Schema({
    activities: {
        type: [activities],
        required: true
    },

    durations: {
        type: [Number],
        required: true
    },
    language: {
        type: String,
        required: true
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

});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);
export default Itinerary;