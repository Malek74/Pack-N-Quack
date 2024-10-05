import Tag from '../models/tagSchema.js';


// Create Tag
export const createTag = async (req, res) => {
    const { name, options } = req.body;
    console.log(name);
    console.log(options);


    try {
        //validate if tag already exists
        const isTagExists = await Tag.findOne({ name_tag: name });

        if (isTagExists) {
            return res.status(400).json({ message: "Tag already exists" });
        }


        // Validate if 'options' is a non-empty array
        if (!Array.isArray(options) || options.length === 0) {
            return res.status(400).json({ message: "No options were entered" });
        }

        const createdTags = [];

        // Loop through options and create a tag for each
        for (const option of options) {
            const createdTag = {};
            createdTag.name_tag = name;
            createdTag.options = option;
            const newTag = await Tag.create(
                createdTag
            );
            createdTags.push(newTag); // Add the created tag to the array
        }

        return res.status(201).json(createdTags);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Delete Tag
export const deleteTag = async (req, res) => {
    const { name_tag } = req.params; // Get the name_tag from the parameters

    try {
        const deletedTag = await Tag.find({ name_tag: name_tag }); // Find and delete by name_tag
        console.log(deletedTag);
        if (deletedTag.length == 0) {
            return res.status(404).json({ message: "Tag not found" });
        }
        for (const deletee of deletedTag) {
            await Tag.findByIdAndDelete(deletee._id);
        }


        return res.status(200).json({ message: "Tag deleted successfully" });
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
            createdTag.options = option;
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

        // Respond with the retrieved tags
        res.status(200).json(tags);
    } catch (error) {
        // Log the error for debugging
        console.error("Error retrieving tags:", error.message);

        // Handle any errors that occur during the fetch
        res.status(500).json({ message: "An error occurred while retrieving tags.", error: error.message });
    }
};
