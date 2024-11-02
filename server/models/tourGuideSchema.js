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
    gender: {
        type: String,
        default: "male"
    },
    experienceYears: {
        type: Number,
    },
    previousWork: {
        title: {
            type: String,
        },
        description: {
            type: String,
        },

        duration: {
            type: [Date]
        },

        company: {
            type: String,
        },

    },
    isAccepted: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);

const tourGuide = model('TourGuide', tourGuideSchema);
export default tourGuide