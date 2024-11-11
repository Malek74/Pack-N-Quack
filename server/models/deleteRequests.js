import mongoose from "mongoose";

const deleteRequestSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
    }
});

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);

export default DeleteRequest;
