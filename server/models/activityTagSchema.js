import { Schema, model } from "mongoose";

const activityTagSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
});

const activityTag = model("ActivityTag", activityTagSchema);
export default activityTag