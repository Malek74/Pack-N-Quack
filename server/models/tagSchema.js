import mongoose from "mongoose";
import { Schema } from "mongoose";

const tagSchema = new Schema({
   
    name_tag: {
        type: String,
        required: true,
    },
    options: {
        type: String,
        required: true, 
    },

});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
