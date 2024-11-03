import { Schema, model } from "mongoose";

const purchasedSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId ,
        ref:'tourist', 
        required: true 
    },
    items:{ 
        type:[ Schema.Types.ObjectId] ,
        ref:'product', 
        required: true 
     },
});

const PurchasedItem = model('PurchasedItem', purchasedSchema);
export default PurchasedItem;
