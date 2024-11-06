// routes/fileRoutes.js
import express from 'express';
import { upload, awsUpload } from '../middleware/multer.js';
import { handleImageUpload, handleDocumentUpload, handleImageUploadProduct, fetchUserDocuments, fetchUserImages } from '../controllers/fileController.js';

const router = express.Router();

// Route to handle image uploads
router.post('/images', upload.fields([{ name: 'images', maxCount: 10 }]), handleImageUpload);

// Route to handle document uploads
router.post('/documents/:id', awsUpload.array('documents', 10), handleDocumentUpload);


router.post('/productImage', upload.fields([{ name: 'uploadImages', maxCount: 10 }]), handleImageUploadProduct);

router.post('/fetchDocuments', fetchUserDocuments);
router.post('/fetchImages', fetchUserImages);

export default router;
