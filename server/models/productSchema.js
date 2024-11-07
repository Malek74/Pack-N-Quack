import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    //thmbnail image
    //array of links
    picture: [{
        type: String,
        required: false,
    }],
    price: {
        type: Number,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },

    sellerUsername: {
        type: String,
    },

    stripeID: {
        type: String,
    },

    seller_id: {
        type: Schema.Types.ObjectId,
        ref: 'Seller', // Reference the seller model
    },

    adminSellerID: {
        type: Schema.Types.ObjectId,
        ref: 'Admin', // Reference the adminSeller model
    },

    //list of reviews linked to users
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

    available_quantity: {
        type: Number,
        required: true,
    },
    product_sales: {
        type: Number,
        required: true,
        default: 0,
    },
    isArchived: {
        type: Boolean,
        required: true,
        default: false,
    },
    uploadImages: {
        type: [String],
        default: [],
    }
});

const product = model("Product", productSchema);

export default product;
