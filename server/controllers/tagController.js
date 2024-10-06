import Tag from '../models/tagSchema.js';

// Create Tag
// Create Tag
export const createTag = async (req, res) => {
    const { name, option } = req.body;
    console.log(name);
    console.log(option);

    try {
        //validate that tag does not exist
        const existingTag = await Tag.findOne({ name_tag: name, option: option });
        if (existingTag) {
            return res.status(400).json({ message: "Tag already exists" });
        }

        //create new tag
        const createdTag = await Tag.create({
            name_tag: name,
            option: option
        });

        //return the created tag
        return res.status(200).json(createdTag);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Tag
export const deleteTag = async (req, res) => {
    const { name, option } = req.body; // Get the name_tag from the parameters

    //validate that tage exists 
    const existingTag = await Tag.findOne({ name_tag: name, option: option });

    if (!existingTag) {
        return res.status(404).json({ message: "Tag not found" });
    }

    try {
        const deletedTag = await Tag.findOneAndDelete({ name_tag: name, option: option }); // Find and delete by name_tag

        return res.status(200).json(deletedTag);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Update Tag 
export const updateTag = async (req, res) => {
    const { name } = req.body; // Get the current name_tag from the parameters
    const { options } = req.body; // Get the new name from the request body

    try {
        //fetch all tags options 
        const oldTags = await Tag.find({ name_tag: name });

        //delete all old tags
        for (const tag of oldTags) {
            await Tag.findByIdAndDelete(tag._id);
        }

        //create new tags with the new name and the upadted options
        const createdTags = [];
        for (const option of options) {
            const createdTag = {};
            createdTag.name_tag = name;
            createdTag.option = option;
            const newTag = await Tag.create(
                createdTag
            );
            createdTags.push(newTag); // Add the created tag to the array
        }
        res.status(200).json(createdTags);

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


// Function to retrieve all tags
export const getAllTags = async (req, res) => {
    try {
        // Fetch all tags from the database
        const tags = await Tag.find();

        // If no tags are found, return a message
        if (!tags || tags.length === 0) {
            return res.status(404).json({ message: "No tags found." });
        }

        // Group the tags by the 'name_tag' field
        const groupedTags = tags.reduce((acc, tag) => {
            // Check if the group already exists
            if (!acc[tag.name_tag]) {
                acc[tag.name_tag] = []; // Initialize the group if it doesn't exist
            }
            // Push the current tag's option into the respective group
            acc[tag.name_tag].push(tag.option);
            return acc;
        }, {});

        // Respond with the retrieved tags
        res.status(200).json(groupedTags); // Respond with the grouped tags (name_tag: tags);
    } catch (error) {
        // Log the error for debugging
        console.error("Error retrieving tags:", error.message);

        // Handle any errors that occur during the fetch
        res.status(500).json({ message: "An error occurred while retrieving tags.", error: error.message });
    }
};