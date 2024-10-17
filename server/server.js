// Import necessary modules
import mongoose from 'mongoose';
import admins from './routes/admins.js';
import seller from './routes/seller.js';
import products from './routes/products.js';
import itinerary from './routes/itinerary.js'
import tourGuide from './routes/tourGuide.js'
import express from 'express';
import tagRoutes from './routes/tagRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import touristRoutes from './routes/touristRoutes.js'

import { isTourismGovernor } from './middleware/auth.js';
import touristGoverner from './routes/touristGovernor.js';
import itineraryTag from './routes/itineraryTag.js';
import advertisers from './routes/advertisers.js';
import activity from './routes/activity.js';
import activityCategory from './routes/activityCategory.js';
import activityTag from './routes/activityTag.js';
import logger from './middleware/logger.js';
import { config } from 'dotenv';
import cors from 'cors';
import uploadImg from './routes/uploadImg.js';
import shareMail from './routes/shareMail.js';
import flightBooking from './routes/flightBooking.js';
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

// Middleware to enable CORS
app.use(cors());

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
app.use('/api/tags', tagRoutes); //tags for places
app.use('/api/places', placeRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/sellers', seller);
app.use('/api/products', products);
app.use('/api/itinerary', itinerary);
app.use('/api/tourGuide', tourGuide);
app.use('/api/touristGovernor', touristGoverner);
app.use('/api/itiernaryTags', itineraryTag);
app.use('/api/advertisers', advertisers);
app.use('/api/activity', activity)
app.use('/api/activity/category', activityCategory);
app.use('/api/activity/tag', activityTag);
app.use('/api/upload', uploadImg);
app.use('/api/share/', shareMail);
app.use('/api/bookFlight', flightBooking);
