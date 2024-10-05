import { Schema, model } from "mongoose";

const activityCategorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
})

const activityCategory = model("ActivityCategory", activityCategorySchema);
export default activityCategory