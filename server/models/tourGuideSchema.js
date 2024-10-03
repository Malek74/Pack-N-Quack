import { Schema, model } from 'mongoose';

const tourGuideSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
    },
    experienceYears: {
        type: Number,
    },
    previousWork: {
        type: String,
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);

const tourGuide = model('TourGuide', tourGuideSchema);
export default tourGuide;