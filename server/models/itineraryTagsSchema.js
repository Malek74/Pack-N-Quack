import mongoose from "mongoose";

const itineraryTagsSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
    },
});

const itineraryTags = mongoose.model("itineraryTags", itineraryTagsSchema);

export default itineraryTags;