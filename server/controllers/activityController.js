import mongoose from "mongoose";
import activity from "../models/activitySchema.js";

// @desc Get all activities
// @route GET /api/activity
export const getActivities = async (req, res) => {
    try {
        const activities = await activity.find({}).populate('advertiserID categoryID');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity
// @route POST /api/activity
// @Body { advertiserID, categoryID, date, location, priceType, price, minPrice, maxPrice, tags, specialDiscounts, isBookingOpen, duration, name }
export const addActivity = async (req, res) => {
    const priceType = req.body.priceType;
    if (priceType === 'range') {
        if (!req.body.minPrice || !req.body.maxPrice) {
            return res.status(400).json({ message: 'Please add a min and max price' });
        }
    } else {
        if (!req.body.price) {
            return res.status(400).json({ message: 'Please add a price' });
        }
    }
    const newActivity = new activity(req.body);
    try {
        const a = await newActivity.save();
        res.status(200).json(a);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Update an activity
// @route PUT /api/activity/edit/:id
// @params id of activity
// @Body { advertiserID, categoryID, date, location, priceType, price, minPrice, maxPrice, tags, specialDiscounts, isBookingOpen, duration, name }
export const updateActivity = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    //const _id = mongoose.Types.ObjectId(id);
    try {
        const updatedActivity = await activity.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedActivity);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Delete an activity
// @route DELETE /api/activity/delete/:id
// @params id of activity
export const deleteActivity = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedActivity = await activity.findByIdAndDelete(id);
        res.status(200).json(deletedActivity);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Search for an activity based on Name ,Category or Tag
// @route GET /api/activity/search
// @Body { searchBy, name, categoryID, tagID }
export const searchActivity = async (req, res) => {
    const searchBy = req.body.searchBy; // name, category, tag
    const name = req.body.name;
    const categoryID = req.body.categoryID;
    const tagID = req.body.tagID;
    let a;

    switch (searchBy) {
        case "name":
            a = await activity.findOne({ name: name });
            if (!a) {
                return res.status(404).json({ message: 'Activity not found' });
            }
            res.status(200).json(a);
            break;
        case "category":
            a = await activity.findOne({ categoryID: categoryID });
            if (!a) {
                return res.status(404).json({ message: 'Activities not found' });
            }
            res.status(200).json(a);
            break;
        case "tag":
            a = await activity.findOne({ tagID: tagID });
            if (!a) {
                return res.status(404).json({ message: 'Activities not found' });
            }
            res.status(200).json(a);
            break;
        default:
            break;
    }
}

// @desc Get all upcoming activities
// @route GET /api/activity/upcoming
export const getUpcomingActivities = async (req, res) => {
    try {
        const today = new Date();
        console.log(today)
        const activities = await activity.find({ date: { $gte: today } }).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}