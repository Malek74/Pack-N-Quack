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
    address: [{
        address: {
            type: String,
            required: true,
        },
        town: {
            type: String,
            required: true,
        },
        postcode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    }],
    defaultAddress: {
        address: {
            type: String,
            required: true,
        },
        town: {
            type: String,
            required: true,
        },
        postcode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
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
    savedEvents: {
        savedItineraries: [{
            type: Schema.Types.ObjectId,
            ref: 'Itinerary'
        }],
        savedActivities: [{
            type: Schema.Types.ObjectId,
            ref: 'Activity'
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
    },

    cart: {
        type: [
            {
                _id: false,
                productID: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                },

                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        default: []
    },

    wishlist: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Product',
            }
        ],
        default: []
    },

},
    { timestamps: true }
);

const tourist = model("Tourist", touristSchema);
export default tourist;