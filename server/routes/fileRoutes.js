// routes/fileRoutes.js
import express from 'express';
import { upload, awsUpload } from '../middleware/multer.js';
import { handleImageUpload, handleDocumentUpload, handleImageUploadProduct, fetchAllDocuments, fetchUserDocuments, fetchUserImages } from '../controllers/fileController.js';
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

// Route to handle image uploads
router.post('/images/', protect, upload.fields([{ name: 'images', maxCount: 10 }]), handleImageUpload);

// Route to handle document uploads
router.post('/documents', protect, awsUpload.array('documents', 10), handleDocumentUpload);


router.post('/productImage', upload.fields([{ name: 'uploadImages', maxCount: 10 }]), handleImageUploadProduct);

router.post('/fetchDocuments', protect, fetchUserDocuments);
router.post('/fetchAllDocuments', fetchAllDocuments);
router.post('/fetchImages/',protect, fetchUserImages);

export default router;
