import { Schema, model } from "mongoose";
import product from "../models/productSchema.js";

const purchasedSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'tourist',
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        boughtNtimes: { type: Number },
        rating: { type: Number },
        review: { type: String },
        status :{ type : String, default: "pending"  }
    }],
    
}, 
{ timestamps: true }
);

const PurchasedItem = model('PurchasedItem', purchasedSchema);
export default PurchasedItem;
