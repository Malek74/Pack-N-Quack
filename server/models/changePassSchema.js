import { Schema, model } from "mongoose";

const changePassSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
   // userType: { type: String, enum: ['Seller', 'Advertiser', 'Tourist','Tour Guide','Tourism Governer'], required: true },
   userType: { type: String, required: true },
   requestedPassword: { type: String, required: true },
   // status: { type: String, enum: ['pending', 'approved', 'declined'], default: 'pending' },
   status: { type: String, default: 'pending' },
    requestedAt: { type: Date, default: Date.now },
});

export const PasswordChangeRequest = model('PasswordChangeRequest', changePassSchema);
