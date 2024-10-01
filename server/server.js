// Import necessary modules
import mongoose from 'mongoose';
import admins from './routes/admins.js';
import advertisers from './routes/advertisers.js';
import activity from './routes/activity.js';
import express from 'express';
import logger from './middleware/logger.js';
import { config } from 'dotenv';

config();
const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

app.use(logger);
// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Define Endpoints
app.use('/api/admins', admins);
app.use('/api/advertisers', advertisers);
app.use('/api/activity', activity)