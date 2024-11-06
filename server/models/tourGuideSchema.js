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
                default: null
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    uploadedFiles: {
        images: { type: [String], default: [], required: false },
        documents: [{
            name: String,
            link: String
        }
        ]
    },

    hasAcceptedTerms: {
        type: Boolean,
        default: false
    },
},
    { timestamps: true }
);

const tourGuide = model('TourGuide', tourGuideSchema);
export default tourGuide