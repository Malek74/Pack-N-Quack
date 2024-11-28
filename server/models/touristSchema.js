import { Schema, model } from "mongoose";


const touristSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        default: ''
    },
    wallet: {
        type: Number,
        default: 0,
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
    },

    level: {
        type: Number,
        default: 1,
    },
    profileImagePath: {
        type: String,
        default: "/assets/images/defaultProfilePicture.webp"
    },

    preferredCurrency: {
        type: String,
        default: "EGP"
    },
    gender: {
        type: String,
        default: "male"
    },
    stripeID: {
        type: String

    },

    preferences: {
        preferredItineraries: [{
            type: Schema.Types.ObjectId,
            ref: 'itineraryTags'
        }],
        preferredActivities: [{
            type: Schema.Types.ObjectId,
            ref: 'ActivityTag'
        }],

        preferredPlaces: [{
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }],
    },
    promoCode: {
        code: {
            type: String,
            default: ''
        },
        lastUsed: {
            type: Date,
            default: Date.now()
        }
    }


},
    { timestamps: true }
);

const tourist = model("Tourist", touristSchema);
export default tourist;