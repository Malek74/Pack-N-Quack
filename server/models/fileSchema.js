// models/UploadedFile.js
import mongoose from 'mongoose';

const uploadedFileSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    userType: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('UploadedFile', uploadedFileSchema);
