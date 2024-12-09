import mongoose, { mongo } from "mongoose";

const webSocket = new mongoose.Schema({

    socketID: {
        type: String,
        required: true
    },
    user: {
        id: { type: mongoose.Schema.Types.ObjectId, required: true },
        role: { type: String, enum: ['Tourist', 'TourGuide', 'Advertiser', 'Seller'], required: true },
    },

});
const SocketConnection = mongoose.model('SocketConnection', webSocket);

export default SocketConnection;