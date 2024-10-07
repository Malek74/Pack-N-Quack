import mongoose from "mongoose";
import activityCategory from "../models/activityCategorySchema.js";
import activityModel from "../models/activitySchema.js";
// @desc Get all activity categories
// @route GET /api/activity/category
export const getActivityCateogries = async (req, res) => {
    try {
        const categories = await activityCategory.find({});
        res.status(200).json(categories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Get a single activity category
// @route GET /api/activity/category/:id
// @params id of activity category
export const getActivityCateogry = async (req, res) => {
    const name = req.params.name;
    try {
        const category = await activityCategory.findOne({ name: name });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(category);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity category
// @route POST /api/activity/category
// @Body { name }
export const addActivityCategory = async (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ message: 'Please add a name' });
    }
    const categoryExists = await activityCategory.findOne({ name });
    if (categoryExists) {
        return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new activityCategory({ name });
    try {
        const a = await newCategory.save();
        return res.status(200).json(a);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Update an activity category
// @route PUT /api/activity/category/edit/:id
// @params id of activity category
// @Body { name }
export const updateActivityCategory = async (req, res) => {
    const name = req.params.name;
    try {
        const updatedCategory = await activityCategory.findOneAndUpdate({ name: name }, req.body, { new: true });
        if (updatedCategory === null) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(updatedCategory);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Delete an activity category
// @route DELETE /api/activity/category/delete/:id
// @params id of activity category
export const deleteActivityCategory = async (req, res) => {
    const name = req.params.name;
    try {
        const categoryToDelete = await activityCategory.findOne({ name: name });
        const deletedActivities = await activityModel.deleteMany({ categoryID: categoryToDelete._id });
        const deletedCategory = await activityCategory.findOneAndDelete({ name: name });
        console.log(deletedActivities);
        if (deletedCategory === null) {
            return res.status(404).json({ message: 'Category not found' });
        }
        return res.status(200).json(deletedCategory);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}
