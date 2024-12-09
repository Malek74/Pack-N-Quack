import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    },
    status: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending'
    }
});

const otpModel = mongoose.model('otp', otpSchema);

export default otpModel;
