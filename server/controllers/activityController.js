import mongoose from "mongoose";
import activityModel from "../models/activitySchema.js";
import activityTag from "../models/activityTagSchema.js";
import activityCategory from "../models/activityCategorySchema.js";

// @desc Get all activities
// @route GET /api/activity
export const getActivities = async (req, res) => {
    try {
        const activities = await activityModel.find({}).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity
// @route POST /api/activity
// @Body { advertiserID, categoryID, date, location, priceType, price, minPrice, maxPrice, tags, specialDiscounts, isBookingOpen, duration, name }
export const addActivity = async (req, res) => {
    console.log(req.body)
    if (!req.body.advertiserID) {
        req.body.advertiserID = new mongoose.Types.ObjectId("66ffe2acd9af7892d8193dad");
    }
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
    if (req.body.tags) {
        const tags = req.body.tags;
        let tagsIDs = [];
        for (let i = 0; i < tags.length; i++) {
            const tag = await activityTag.findOne({ name: tags[i] });
            tagsIDs.push(tag._id);
        }
        req.body.tags = tagsIDs
    }
    if (req.body.categoryID) {
        const category = await activityCategory.findOne({ name: req.body.categoryID });
        req.body.categoryID = category._id
    }
    console.log(req.body)
    const newActivity = new activityModel(req.body);
    try {
        const a = await newActivity.save();
        console.log(a)
        return res.status(200).json(a);
    } catch (error) {
        console.log(error)
        return res.status(404).json({ message: error.message });
    }
}

// @desc Update an activity
// @route PUT /api/activity/edit/:id
// @params id of activity
// @Body { advertiserID, categoryID, date, location, priceType, price, minPrice, maxPrice, tags, specialDiscounts, isBookingOpen, duration, name }
export const updateActivity = async (req, res) => {
    const id = req.params.id;
    console.log(id)
    console.log(req.body)
    if (req.body.tags) {
        const tags = req.body.tags;
        let tagsIDs = [];
        for (let i = 0; i < tags.length; i++) {
            const tag = await activityTag.findOne({ name: tags[i] });
            tagsIDs.push(tag._id);
        }
        req.body.tags = tagsIDs
    }
    if (req.body.categoryID) {
        const category = await activityCategory.findOne({ name: req.body.categoryID });
        req.body.categoryID = category._id
    }
    console.log(req.body)
    try {
        const updatedActivity = await activityModel.findByIdAndUpdate(id, req.body, { new: true });
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
        const deletedActivity = await activityModel.findByIdAndDelete(id);
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
            a = await activityModel.find({ name: name });
            if (!a) {
                return res.status(404).json({ message: 'Activity not found' });
            }
            res.status(200).json(a);
            break;
        case "category":
            a = await activityModel.find({ categoryID: categoryID });
            if (!a) {
                return res.status(404).json({ message: 'Activities not found' });
            }
            res.status(200).json(a);
            break;
        case "tag":
            a = await activityModel.find({ tags: { $in: [tagID] } }).populate('advertiserID categoryID tags');
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
        const activities = await activityModel.find({ date: { $gte: today } }).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Post a review
// @route POST /api/activity/review
// @params id of activity
// @Body { touristID, review, rating }
export const postReview = async (req, res) => {
    const id = req.params.id;
    const { touristID, review, rating } = req.body;
    try {
        const activity = await activityModel.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        activity.ratings.reviews.push({ touristID, review, rating });
        const reviews = activity.ratings.reviews;
        let totalRating = 0;
        for (let i = 0; i < reviews.length; i++) {
            totalRating += reviews[i].rating;
        }
        activity.ratings.averageRating = totalRating / reviews.length;
        await activity.save();
        res.status(200).json(activity);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Filter activities by budget or date or category or rating
// @route GET /api/activity/filter
// @Body { budget, date, categoryID, rating }
export const filterAndSortActivities = async (req, res) => {
    const { budgetMin, budgetMax, dateMin, dateMax, categoryID, rating, sortPrice, sortRating } = req.query;

    let query = {};

    if (budgetMin && budgetMax) {
        query.$or = [
            { $and: [{ priceType: 'fixed' }, { price: { $gte: budgetMin, $lte: budgetMax } }] },
            { $and: [{ priceType: 'range', minPrice: { $gte: budgetMin, $lte: budgetMax } }] },
            { $and: [{ priceType: 'range', maxPrice: { $gte: budgetMin, $lte: budgetMax } }] },
        ];
    }
    if (dateMin && dateMax) {
        query.date = { $gte: dateMin, $lte: dateMax };
    }
    if (categoryID) {
        query.categoryID = categoryID;
    }
    if (rating) {
        query['ratings.averageRating'] = { $gte: rating };
    }
    try {
        if (sortPrice !== undefined || sortRating !== undefined) {
            const activities = await activityModel.aggregate([
                { $match: query }, // Apply filters

                // Add a virtual field called "normalizedPrice"
                {
                    $addFields: {
                        normalizedPrice: {
                            $cond: {
                                if: { $eq: ["$priceType", "fixed"] }, // If priceType is "fixed"
                                then: "$price", // Use the price value
                                else: "$minPrice"// For range, use the average of minPrice and maxPrice
                            }
                        }
                    }
                },

                // Sort based on the normalized price and/or rating
                {
                    $sort: {
                        ...(sortPrice !== undefined ? { normalizedPrice: sortPrice } : {}), // Sort by price if specified
                        ...(sortRating !== undefined ? { 'ratings.averageRating': sortRating } : {}) // Sort by rating if specified
                    }
                }
            ]).exec();
            res.status(200).json(activities);
        } else {
            const activities = await activityModel.find(query).populate('advertiserID categoryID tags');
            res.status(200).json(activities);
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}