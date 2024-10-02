// Import necessary modules
import mongoose from 'mongoose';
import admins from './routes/admins.js';
import itinerary from './routes/itinerary.js'
import tourGuide from './routes/tourGuide.js'
import express from 'express';
import touristGoverner from './routes/touristGovernor.js';
import itineraryTag from './routes/itineraryTag.js';

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
app.use('/api/itinerary', itinerary);
app.use('/api/tourGuide', tourGuide);
app.use('/api/touristGovernor', touristGoverner);
app.use('/api/itiernaryTags', itineraryTag);