import { Schema, model } from "mongoose";

// Define a schema for the uploaded documents
const documentSchema = new Schema({
   
    filename: {
        type: String,
        required: true,  
    },
    path: {
        type: String,
        required: true,  
    },
    submittedAt: {
        type: Date,
        default: Date.now,  // Automatically set to the current date and time
    },
});

// Create a model from the schema
const Document = model('Document', documentSchema);

// Export the model
export default Document;
