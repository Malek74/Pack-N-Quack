import { Schema, model } from "mongoose";

const touristGovernerSchema = new Schema({
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

const touristGoverner = model("TouristGoverner", touristGovernerSchema);
export default touristGoverner;