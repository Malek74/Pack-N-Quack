import { Schema, model} from "mongoose";

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
    },
   description: {
        type: String,
        required: true,
    },
    //add seller name
    seller_id: {
        type: Schema.Types.ObjectId,
        ref: "Seller",
        required: true,
    },
    ratings: {
        type: Number,
        required: false,
    },
    //list of reviews linked to users
//    ratings: {
//         averageRating: {
//             type: Number,
//             default: 0, // Default to 0 for activities with no ratings
//             min: 0,
//             max: 5
//         },
//         reviews: [{
//             userID: {
//                 type: Schema.Types.ObjectId,
//                 ref: 'User', // Reference to the User model
//                 required: true
//             },
//             rating: {
//                 type: Number,
//                 required: true,
//                 min: 1,
//                 max: 5
//             },
//             review: {
//                 type: String,
//                 default: '' // Optional text review
//             },
//             date: {
//                 type: Date,
//                 default: Date.now
//             }
//         }]
//     },    
    reviews: {
        type: String,
        required: false,  
    },
    available_quantity: {
        type: Number,
        required: true,
    },
});

const product = model("Product", productSchema);

export default product;
