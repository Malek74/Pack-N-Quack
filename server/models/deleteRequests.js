import mongoose from "mongoose";

const deleteRequestSchema = new mongoose.Schema({
    touristID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
    },
    tourGuideID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide',
    },
    advertiserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advertiser',
    },
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);

export default DeleteRequest;
