import express from 'express';
import upload from '../middleware/multer.js'; 
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

router.post('/', upload.array('images', 10), async (req, res) => {
    console.log('Uploaded files:', req.files);
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No images uploaded.' });
    }

    try {
        const imagesUrls = [];
        
        // Process each file in the uploaded files
        for (const file of req.files) {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, '_'); // Sanitize the file name
            const publicId = `${sanitizedPublicId}`; // Optionally add a folder

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'auto',
                        public_id: publicId, // Use the sanitized original file name
                        overwrite: true, // Optional: Set to true if you want to overwrite existing images with the same public_id
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer); // Pipe the file buffer to Cloudinary upload stream
            });

            imagesUrls.push(result.secure_url); // Store the uploaded image URL
        }

        res.status(200).json({ message: 'Images uploaded successfully', imagesUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;




