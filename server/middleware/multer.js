import multer from 'multer';

// Use memory storage to handle file buffers
const storage = multer.memoryStorage();

// Set up multer to accept multiple files
export const upload = multer({ storage: storage });
export const awsUpload = multer({ storage: multer.memoryStorage() });



