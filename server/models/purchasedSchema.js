import { Schema, model } from "mongoose";

const purchasedSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'tourist',
        required: true
    },
    items: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',  
            required: true
        },
        boughtNtimes: {type: Number},
        rating: { type: Number },
        review: { type: String }
    }]
});

const PurchasedItem = model('PurchasedItem', purchasedSchema);
export default PurchasedItem;
