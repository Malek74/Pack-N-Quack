
import Places from '../models/PlacesSchema.js';
import Tag from '../models/tagSchema.js';


// Create Place function
export const createPlace = async (req, res) => {
    const {
        name,
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
        // Check for location and name duplicates 
        const existingPlace = await Places.findOne({
            location: location
        });

        if (existingPlace) {
            const messages = [];
            if (existingPlace.location === location) {
                messages.push("A place with this location already exists.");
            }

            return res.status(400).json({ message: messages.join(' ') });
        }

        const createdTags = [];
        // Loop through tags array to validate and store them
        for (const tag of tags) {
            // Check if the tag and its options already exist to restrict TG
            const existingTag = await Tag.findOne({
                name_tag: tag.name_tag,
                options: { $in: tag.options }  // Ensure option exists within the tag
            });

            if (!existingTag) {
                return res.status(400).json({
                    message: `The tag "${tag.name_tag}" with option "${tag.options}" does not exist. Please select from existing options.`
                });
            }

            createdTags.push(existingTag);
        }


        const newPlace = await Places.create({
            name,
            description,
            pictures,
            location,
            opening_hour,
            ticket_price_native,
            ticket_price_foreigner,
            ticket_price_student,
            tags: createdTags.map(tag => tag._id),
        });

        res.status(201).json(newPlace);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read Place function
export const readPlace = async (req, res) => {
    const { name } = req.params;
    try {
        // Search for the place by its name
        const place = await Places.findOne({ name }).populate('tags');

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePlace = async (req, res) => {
    const { name } = req.params; // Get the place name from the URL parameters
    const updates = req.body; // The updates from the request body

    try {
        // Find the place by its name
        const place = await Places.findOne({ name });

        // If place is not found, return an error
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Check if tags are being updated
        if (updates.tags) {
            const newTagIds = [];
            for (const tag of updates.tags) {
                // Check if the provided tag already exists
                let existingTag = await Tag.findOne({ name_tag: tag.name_tag, options: tag.options });

                // If the tag does not exist, create it
                if (!existingTag) {
                    existingTag = await Tag.create({ name_tag: tag.name_tag, options: tag.options });
                }

                // Push the tag's ID into the newTagIds array
                newTagIds.push(existingTag._id);
            }

            // Link the new tags to the place without deleting old tags
            updates.tags = newTagIds;
        }

        // Update the place with the new data and populate tags
        const updatedPlace = await Places.findOneAndUpdate(
            { name }, // Match the place by name
            { $set: updates }, // Apply the updates
            { new: true } // Return the updated document
        ).populate('tags'); // Populate the tags in the response

        // Respond with the updated place
        res.status(200).json(updatedPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all places
export const getAllPlaces = async (req, res) => {
    console.log("get all places");
    try {
        // Find all places in the database
        const places = await Places.find().populate('tags'); // Populate tags if you want tag details as well

        // Send back the list of places
        res.status(200).json(places);
    } catch (error) {
        // Handle any errors that occur during the request
        res.status(500).json({ message: error.message });
    }
};

// Delete Place function
export const deletePlace = async (req, res) => {
    const { name } = req.params;  // Ensure name is passed in the request body
    console.log(name);
    try {
        // Find the place by name and delete it
        const deletedPlace = await Places.findOneAndDelete({ name });  // Use correct query object

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json({ message: "Place deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search for a specific place using name and/or tag
export const SearchForPlace = async (req, res) => {
    const { name } = req.query; // Assume name is a path parameter
    const { tagsName, tagsOption } = req.query;   // Assume tags are passed as query parameters


    try {
        const matchCriteria = {};

        // If name is provided, add it to the match criteria
        if (name) {
            matchCriteria.name = { $regex: name, $options: 'i' };
        }


        // If tags are provided, process them
        if (tagsName && tagsOption) {

            // Convert the tags string to an array
            const tagsNameArr = tagsName.split(',').map(tag => tag.trim());
            console.log(tagsNameArr);

            // Convert the tags string to an array
            const tagsOptionArr = tagsOption.split(',').map(tag => tag.trim());
            console.log(tagsOptionArr)

            // Find matching tags in the database
            let matchingTags = [];
            for (let i = 0; i < tagsNameArr.length; i++) {
                console.log(tagsNameArr[i] + ":" + tagsOptionArr[i]);
                const tag = await Tag.findOne({
                    name_tag: tagsNameArr[i],
                    options: tagsOptionArr[i] // Ensure we match the specified options
                });
                matchingTags.push(tag._id);
            }

            console.log(matchingTags);

            // If matching tags are found, add them to the match criteria
            if (matchingTags.length > 0) {

                //fetch only data that has all the tags
                matchCriteria.tags = { $all: matchingTags };

            }

        }

        // Search for places based on the constructed match criteria
        const searchedPlaces = await Places.find(matchCriteria).populate('tags');

        if (searchedPlaces.length === 0) {
            return res.status(404).json({ message: "No places found matching the criteria" });
        }

        res.status(200).json(searchedPlaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Filter places by tag
export const FilterPlacesByTag = async (req, res) => {
    const { tags } = req.query; // Assume the tag is passed as a query parameter in the format: tag=name_tag,options
    console.log(tags);

    try {
        // Validate the tag input
        if (!tag || typeof tag !== 'string') {
            return res.status(400).json({ message: "Invalid tag format. Provide a tag in the format: name_tag,options." });
        }

        // Split the tag into name_tag and options
        const [name_tag, options] = tag.split(',').map(item => item.trim());

        // Find matching tags in the database
        const matchingTags = await Tag.find({
            name_tag: name_tag,
            options: options // Ensure we match the specified options
        }).distinct('_id');

        // If no matching tags found, return a 404 response
        if (matchingTags.length === 0) {
            return res.status(404).json({ message: "No matching tags found." });
        }

        // Fetch places that have the matching tags
        const filteredPlaces = await Places.find({ tags: { $in: matchingTags } }).populate('tags');

        if (filteredPlaces.length === 0) {
            return res.status(404).json({ message: "No places found with the specified tag." });
        }

        res.status(200).json(filteredPlaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

