const express = require('express');
const multer = require('multer'); // For handling file uploads
const cloudinary = require('cloudinary').v2;
const path = require('path');

const app = express();

// Configure Multer for file handling
const upload = multer({ dest: 'uploads/' });

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret'
});

// Route to handle PDF upload

