import mongoose from "mongoose";
import { Schema } from "mongoose";

const tagSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    period: {
        type: String,
        default: null, // Period is not always going to be filled
    },
    name: {
        type: String,
        required: true,
    },
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
