import { Schema, model } from "mongoose"

const complaintSchema = new Schema({
    issuer: {
        type: Schema.Types.ObjectId,
        ref: "Tourist",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending",
        required: true
    },
    reply: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    }


}, { timestamps: true })

const complaintModel = model("Complaint", complaintSchema);
export default complaintModel;