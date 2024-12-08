import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({

    amount: {
        type: Number,
        required: true
    },
    incoming: {
        type: Boolean,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },

    method: {
        type: String,
        enum: ['card', 'wallet'],
        required: true
    }
}
);

const transactionModel = mongoose.model('transaction', transactionSchema);
export default transactionModel;
