// Import necessary modules
import mongoose from 'mongoose';
import admin from './models/AdminSchema.js'; // Adjust the path to your admin model file

// MongoDB connection URI
const mongoURI = 'mongodb+srv://captianquackerss:elbataaa@stillpacking.zfrig.mongodb.net/PackNQuack?retryWrites=true&w=majority&appName=StillPacking';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Function to create and save a new admin
async function createAdmin(username, password) {
    try {
        // Create a new admin instance
        const newAdmin = new admin({
            username: username,
            password: password,
        });

        // Save the admin to the database
        await newAdmin.save();
        console.log("Admin saved successfully:", newAdmin);
    } catch (error) {
        console.error("Error saving admin:", error.message);
    } finally {
        // Close the MongoDB connection (optional in some use cases)
        mongoose.connection.close();
    }
}

// Sample usage
createAdmin("Malek", "password"); // Replace with actual username and password