import mongoose from "mongoose";
import activityTag from "../models/activityTagSchema.js";

// @desc Get all activity tags
// @route GET /api/activity/tag
export const getActivityTags = async (req, res) => {
    try {
        const tags = await activityTag.find({});
        return res.status(200).json(tags);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Get a single activity tag
// @route GET /api/activity/tag/:id
export const getActivityTag = async (req, res) => {
    const name = req.params.name;
    try {
        const tag = await activityTag.findOne({ name: name });
        if (!tag) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        return res.status(200).json(tag);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity tag
// @route POST /api/activity/tag
// @Body { name }
export const addActivityTags = async (req, res) => {
    const tag = req.body;
    if (!tag.name) {
        return res.status(400).json({ message: 'Tag name is required' });
    }
    const tagExists = await activityTag.findOne({ name: tag.name });
    if (tagExists) {
        return res.status(400).json({ message: 'Tag already exists' });
    }
    const newTag = new activityTag(tag);
    try {
        await newTag.save();
        return res.status(201).json(newTag);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

// @desc Delete an activity tag
// @route DELETE /api/activity/tag/delete/:id
// @params id of activity tag
export const deleteActivityTag = async (req, res) => {
    const name = req.params.name;
    try {
        console.log(name);
        const deletedTag = await activityTag.findOneAndDelete({ name: name });
        console.log(deletedTag);
        if (deletedTag === null) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        return res.status(200).json(deletedTag);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Update an activity tag
// @route PUT /api/activity/tag/edit/:id
// @params id of activity tag
// @Body { name }
export const updateActivityTag = async (req, res) => {
    const name = req.params.name
    console.log(name);
    console.log(req.body);
    if (!req.body.name) {
        return res.status(400).json({ message: 'Tag name is required' });
    }
    try {
        const updatedTag = await activityTag.findOneAndUpdate({ name: name }, req.body, { new: true });
        console.log(updatedTag);
        if (updatedTag === null) {
            return res.status(404).json({ message: 'Tag not found' });
        }
        return res.status(200).json(updatedTag);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}