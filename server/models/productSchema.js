import mongoose from "mongoose";
import { Schema } from "mongoose";

const advertiserSchema = new Schema({
    picture: {
        type: String,
        required: true,
    },
    price: {
        type: Double,
        required: true,
    },
   description: {
        type: String,
        required: true,
    },
    seller_id: {
        type: String,
        required: true,
    },
    ratings: {
        type: Double,
        required: false,
    },
    reviews: {
        type: String,
        required: false,  
    }
});

const Product = mongoose.model("Product", advertiserSchema);

export default Product;
