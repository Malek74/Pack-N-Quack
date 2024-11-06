import cloudinary from '../utils/cloudinary.js';
import tourGuide from "../models/tourGuideSchema.js";
import seller from "../models/sellerSchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import touristGoverner from "../models/touristGovernorScehma.js";
import tourist from "../models/touristSchema.js";
import product from '../models/productSchema.js'
import AWS from 'aws-sdk';

const userModels = {
    seller,
    advertiserModel,
    tourist,
    tourGuide,
    touristGoverner
};

// Function to handle image uploads
export const handleImageUpload = async (req, res) => {
    const { userType, userId } = req.body;
    const UserModel = userModels[userType];

    if (!UserModel) {
        return res.status(400).json({ message: 'Invalid user type' });
    }

    const userExists = await UserModel.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: 'User ID does not exist' });
    }
    if (!req.files || !req.files['images']) {
        return res.status(400).json({ message: 'No documents uploaded.' });
    }

    try {
        const imagesUrls = [];

        for (const file of req.files['images']) {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
            const publicId = sanitizedPublicId;

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'image',
                        public_id: publicId,
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            imagesUrls.push(result.secure_url);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            uploadedFiles: {
                images: imagesUrls,
                documents: userExists.uploadedFiles.documents,
            }
        }
            , { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or update failed' });
        }

        res.status(200).json({ message: 'Images uploaded successfully', imagesUrls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const handleDocumentUpload = async (req, res) => {
    const { userType, userId, documentNames } = req.body;
    const UserModel = userModels[userType];

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    if (!UserModel) {
        return res.status(400).json({ message: 'Invalid user type' });
    }
    console.log(req.body);
    //const userExists = await UserModel.exists({ _id: userId });
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
        return res.status(404).json({ message: 'User ID does not exist' });
    }
    // console.log(JSON.parse(req.body.documents));
    console.log(req.files['documents'])
    if (!req.files || !req.files['documents']) {
        return res.status(400).json({ message: 'No documents uploaded.' });
    }
    try {
        const documents = [];
        let i = 0;
        for (const file of req.files['documents']) {
            const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
            const publicId = sanitizedPublicId;
            //console.log(userExists.uploadedFiles);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: 'raw',
                        public_id: publicId,
                        overwrite: true,
                    },
                    (error, result) => {
                        if (error) {
                            return reject(error);
                        }
                        resolve(result);
                    }
                );

                uploadStream.end(file.buffer);
            });

            const generatePDFUrl =
                cloudinary.url(result.sec, {
                    resource_type: 'raw', // Ensures Cloudinary treats it as a file and not an image
                    format: 'pdf',
                    secure: true      // Forces the file to be served as PDF format
                });



            console.log(generatePDFUrl);

            documents.push({ name: documentNames[i], url: generatePDFUrl });
            i++;
        }
        //console.log(userExists.uploadedFiles);

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            uploadedFiles: {
                images: userExists.uploadedFiles.images,
                documents: documents,
            }
        }
            , { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found or update failed' });
        }

        res.status(200).json({ message: 'Documents uploaded successfully', documents });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const handleImageUploadProduct = async (req, res) => {
    const { productId } = req.body;

    const productExists = await product.findById(productId);
    if (!productExists) {
        return res.status(404).json({ message: 'Product ID does not exist' });
    }

    if (!req.files || !req.files.uploadImages) {
        return res.status(400).json({ message: 'No images uploaded.' });
    }

    try {
        const imagesUrls = [];

        // Upload each image to Cloudinary
        for (const file of req.files.uploadImages) { // Access files using 'uploadImages'
            try {
                const sanitizedPublicId = file.originalname.split('.')[0].replace(/[^a-zA-Z0-9-]/g, '');
                const publicId = sanitizedPublicId;

                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'image',
                            public_id: publicId,
                            overwrite: true,
                        },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload error:", error);
                                return reject(error);
                            }
                            resolve(result);
                        }
                    );

                    uploadStream.end(file.buffer);
                });

                imagesUrls.push(result.secure_url);
            } catch (error) {
                console.error("Error during image upload to Cloudinary:", error);
                return res.status(500).json({ message: 'Error uploading image to Cloudinary.', error });
            }
        }


        const updatedProduct = await product.findByIdAndUpdate(
            productId,
            { $push: { uploadImages: { $each: imagesUrls } } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found or update failed' });
        }

        res.status(200).json({ message: 'Images uploaded successfully', updatedProduct });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


export const fetchUserDocuments = async (req, res) => {
    const { userType, userId, documentName } = req.body;
    const UserModel = userModels[userType];

    if (!UserModel) {
        return res.status(400).json({ message: 'Invalid user type' });
    }

    try {

        const user = await UserModel.findById(userId).select('uploadedFiles.documents');

        if (!user || !user.uploadedFiles || !user.uploadedFiles.documents || !user.uploadedFiles.documents[documentIndex]) {
            return res.status(404).json({ message: 'Document not found for this user' });
        }

        //loop on the documents and get the url for 
        const documentUrl = user.uploadedFiles.documents.find((document) => document.name === documentName).url;

        return res.status(200).json({ document: documentUrl });

    } catch (error) {
        console.error("Error serving user's document:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const fetchUserImages = async (req, res) => {
    const { userType, userId } = req.body;
    const UserModel = userModels[userType];

    if (!UserModel) {
        return res.status(400).json({ message: 'Invalid user type' });
    }

    try {

        const user = await UserModel.findById(userId);

        if (!user || !user.uploadedFiles || !user.uploadedFiles.images) {
            return res.status(404).json({ message: 'Image not found for this user' });
        }


        const imageUrl = user.uploadedFiles.images[0];
        return res.status(200).json({ image: imageUrl });
    } catch (error) {
        console.error("Error serving user's image:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

