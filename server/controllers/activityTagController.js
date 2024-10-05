import mongoose from "mongoose";
import activityTag from "../models/activityTagSchema.js";

// @desc Get all activity tags
// @route GET /api/activity/tag
export const getActivityTags = async (req, res) => {
    try {
        const tags = await activityTag.find({});
        res.status(200).json(tags);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Get a single activity tag
// @route GET /api/activity/tag/:id
export const getActivityTag = async (req, res) => {
    const id = req.params.id;
    try {
        const tag = await activityTag.findById(id);
        res.status(200).json(tag);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity tag
// @route POST /api/activity/tag
// @Body { name }
export const addActivityTags = async (req, res) => {
    const tag = req.body;
    const tagExists = await activityTag.findOne({ name: tag.name });
    if (tagExists) {
        return res.status(409).json({ message: 'Tag already exists' });
    }
    const newTag = new activityTag(tag);
    try {
        await newTag.save();
        res.status(201).json(newTag);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

// @desc Delete an activity tag
// @route DELETE /api/activity/tag/delete/:id
// @params id of activity tag
export const deleteActivityTag = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedTag = await activityTag.findByIdAndDelete(id);
        res.status(200).json(deletedTag);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Update an activity tag
// @route PUT /api/activity/tag/edit/:id
// @params id of activity tag
// @Body { name }
export const updateActivityTag = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedTag = await activityTag.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}