import itineraryTags from "../models/itineraryTagsSchema.js";

//@desc create a new tag
//@route POST api/itineraryTags
//@Body {tag}
export const addTag = async (req, res) => {
    const tag = req.body.name;

    //check if tag is present
    if (!tag) {
        return res.status(400).json({ message: "Tag is required" });
    }

    const tagExists = await itineraryTags.findOne({ tag: tag });

    //check if tag already exists
    if (tagExists) {
        return res.status(400).json({ message: "Tag already exists" });
    }

    try {
        const newTag = new itineraryTags({
            tag: tag
        });

        const createdTag = await itineraryTags.create(newTag);
        return res.status(201).json(createdTag);
    } catch (error) {
        return res.status(500).json({ message: "Error creating tag", error: error.message });
    }

}

export const getTags = async (req, res) => {
    try {
        const tags = await itineraryTags.find();
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching tags", error: error.message });
    }

}

export const deleteTag = async (req, res) => {
    const tag = req.params.name;

    try {
        const tags = await itineraryTags.find({ tag: tag });

        if (!tags) {
            return res.status(404).json({ message: "Tag not found" });
        }

        const deletedTag = await itineraryTags.findOneAndDelete({ tag: tag });
        res.status(200).json(deletedTag);
    } catch (error) {
        res.status(500).json({ message: "Error deleting tag", error: error.message });
    }

}

export const updateTag = async (req, res) => {
    const name = req.params.name;
    const tag = req.body.name;

    try {
        const updatedTag = await itineraryTags.findOneAndUpdate({ tag: name }, { tag: tag }, { new: true });
        return res.status(200).json(updatedTag);
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating tag", error: error.message });
    }
}