import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
})

const adminModel = model("adminSchema", adminSchema);
export default adminModel;