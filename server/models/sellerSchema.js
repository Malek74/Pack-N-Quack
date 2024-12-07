import { Schema, model } from "mongoose";

const sellerSchema = new Schema({
    email: {
        type: String,
        required: true,
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
    },
    description: {
        type: String,
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    uploadedFiles: {
        images: { type: [String], default: [], required: false },
        documents: {
            type: [{
            name: String,
            link: String,
        }],
        default: []
        }
    },
    hasAcceptedTerms: {
        type: Boolean,
        default: false
    },
});

const seller = model("Seller", sellerSchema);

export default seller;