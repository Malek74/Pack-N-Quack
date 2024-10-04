// Import necessary modules
import mongoose from 'mongoose';
import admins from './routes/admins.js';
import express from 'express';
import tagRoutes from './routes/tagRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import touristRoutes from './routes/touristRoutes.js'
import tourismgovernerRoutes from './routes/tourismgovernerRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import advertiserRoutes from './routes/advertiserRoutes.js';
import tourguideRoutes from './routes/tourguideRoutes.js';

import tourist from './models/touristSchema.js';
import touristGoverner from './models/touristGovernor.js';
import seller from './models/sellerSchema.js';
import advertiser from './models/advertiserSchema.js';
import { isTourismGovernor } from './middleware/auth.js';

const app = express();
const port = 8000;
const mongoURI = 'mongodb+srv://captianquackerss:elbataaa@stillpacking.zfrig.mongodb.net/PackNQuack?retryWrites=true&w=majority&appName=StillPacking'

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
})
// Middleware to parse JSON
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

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
app.use('/api/tags', tagRoutes);
app.use('/api/places', placeRoutes);

app.use('/api', tourguideRoutes);
app.use('/api', touristRoutes);
app.use('/api', sellerRoutes);
app.use('/api', advertiserRoutes);
app.use('/api', tourismgovernerRoutes);



