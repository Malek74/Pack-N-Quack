import { model, Schema } from 'mongoose';
import mongoose from 'mongoose';

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ['Tourist', 'TourGuide', 'Advertiser', 'Seller'], required: true },
    },
    isRead: { type: Boolean, default: false },

    date: {
        type: Date,
        default: Date.now
    },

    type: {
        type: String,
        enum: ['bookingOpen', 'reminder', 'outOfStock', 'flag'],
        required: true
    }
});



export default model('Notification', notificationSchema);