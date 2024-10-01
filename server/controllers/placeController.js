import Tourist from "../models/touristSchema.js";
import TourGuide from "../models/tourGuideSchema.js";
import TouristGovernor from "../models/touristGovernor.js"; 
import Seller from "../models/sellerSchema.js";
import Admin from "../models/AdminSchema.js";
import Advertiser from "../models/advertiserSchema.js";
import Places from '../models/PlacesSchema.js';
import Tag from '../models/tagSchema.js';


//Create Tag
export const createTag = async (req, res) => {
    const { type, period, name } = req.body;

    try {
        // Check if a tag with the same name already exists
        const existingTag = await Tag.findOne({ name });

        if (existingTag) {
            return res.status(400).json({ message: "Tag with this name already exists." });
        }

        const newTag = await Tag.create({
            type,
            period,
            name,
        });
        res.status(201).json(newTag); // Respond with the created tag
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle errors
    }
};


// Create Place function
export const createPlace = async (req, res) => {
    const { 
        description, 
        pictures, 
        location, 
        opening_hour, 
        ticket_price_native, 
        ticket_price_foreigner, 
        ticket_price_student, 
        tags 
    } = req.body;

    try {
        // Check for existing places with the same location and tags
        const existingPlaces = await Places.find({ location });

        // Check for duplicate tag names among existing places
        const existingTagNames = existingPlaces.flatMap(place => 
            place.tags.map(tag => tag.name)
        );

        // If any tag names already exist in places, respond with an error
        const duplicateTagNames = tags.filter(tag => 
            existingTagNames.includes(tag.name)
        );

        if (existingPlaces.length > 0 || duplicateTagNames.length > 0) {
            const messages = [];
            if (existingPlaces.length > 0) {
                messages.push("A place with this location already exists.");
            }
            if (duplicateTagNames.length > 0) {
                messages.push("One or more tags already exist: " + duplicateTagNames.map(tag => tag.name).join(', '));
            }
            return res.status(400).json({ message: messages.join(' ') });
        }

        // Create a new place with the provided details
        const newPlace = await Places.create({
            description,
            pictures,
            location,
            opening_hour,
            ticket_price_native,
            ticket_price_foreigner,
            ticket_price_student,
            tags,
        });

        res.status(201).json(newPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Read Place function
export const readPlace = async (req, res) => {
    const { placeId } = req.params; // Get place ID from parameters

    try {
        const place = await Places.findById(placeId).populate('tags'); // Populate tags

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json(place);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update Place function
export const updatePlace = async (req, res) => {
    const { placeId } = req.params; // Get place ID from parameters
    const { tags, ...updates } = req.body; // Destructure tags and other updates from the request body

    try {
        const updatedPlace = await Places.findByIdAndUpdate(
            placeId,
            {
                ...updates,
                $addToSet: { tags: { $each: tags } } // Add new tags without duplicates
            },
            { new: true }
        ).populate('tags'); // Populate tags in the response

        if (!updatedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json(updatedPlace); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete Place function
export const deletePlace = async (req, res) => {
    const { placeId } = req.params; 

    try {
        const deletedPlace = await Places.findByIdAndDelete(placeId);

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//Search for a specific place using name or tag type 
export const SearchForPlace = async (req, res) => {
    const { tags } = req.body; // Expecting tags to be an object with name and type

    try {
        // If tags is not an object, respond with an error
        if (typeof tags !== 'object' || !tags.name && !tags.type) {
            return res.status(400).json({ message: "Invalid tags format" });
        }

        const SearchedPlace = await Places.aggregate([
            {
                $lookup: {
                    from: 'tags', // Name of the Tag collection
                    localField: 'tags', // Field in Places schema that contains tag IDs
                    foreignField: '_id', // Field in Tag schema that contains the IDs
                    as: 'tagDetails' // Output array field
                }
            },
            {
                $match: {
                    $or: [
                        { 'tagDetails.name': tags.name }, // Match by tag name
                        { 'tagDetails.type': tags.type } // Match by tag type
                    ]
                }
            }
        ]);

        if (SearchedPlace.length === 0) {
            return res.status(404).json({ message: "Place not available" });
        }

        res.status(200).json(SearchedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
