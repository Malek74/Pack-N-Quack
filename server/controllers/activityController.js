import mongoose from "mongoose";
import activityModel from "../models/activitySchema.js";
import activityTag from "../models/activityTagSchema.js";
import activityCategory from "../models/activityCategorySchema.js";
import { query } from "express";
import stripe from 'stripe';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);
import { getConversionRate } from "../utils/Helpers.js";

// @desc Get all activities
// @route GET /api/activity
export const getActivities = async (req, res) => {
    const prefCurrency = req.query.currency;
    const conversionRate = await getConversionRate(prefCurrency);

    try {
        let activities = await activityModel.find({}).populate('advertiserID categoryID tags');

        //change price to preferred currency
        activities = activities.map(activity => {
            if (activity.priceType === 'fixed') {
                activity.price = activity.price * conversionRate;
            } else {
                activity.minPrice = activity.minPrice * conversionRate;
                activity.maxPrice = activity.maxPrice * conversionRate;
            }
            return activity;
        });

        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity
// @route POST /api/activity
// @Body { advertiserID, categoryID, date, location, priceType, price, minPrice, maxPrice, tags, specialDiscounts, isBookingOpen, duration, name }
export const addActivity = async (req, res) => {

    const newActivity = req.body;
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

    const stripeProduct = await stripeInstance.products.create({
        name: req.body.name,
        description: req.body.description,
        images: [req.body.image],
    });

    const stripePrice = await stripeInstance.prices.create({
        product: stripeProduct.id,
        unit_amount: req.body.price * 100, //stripe uses cents
        currency: 'usd'
    });

    //todo: change to dynamic currency
    newActivity.stripePriceID = stripePrice.id;
    newActivity.stripeProductID = stripeProduct.id;
    const activityCreated = new activityModel(newActivity);


    try {
        const a = await activityCreated.save();
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
    let activities;
    const currency = req.query.currency;
    const conversionRate = await getConversionRate(currency);

    switch (searchBy) {
        case "name":
            activities = await activityModel.find({ name: name });
            if (!activities) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            //change price to preferred currency
            activities = activities.map(activity => {
                if (activity.priceType === 'fixed') {
                    activity.price = activity.price * conversionRate;
                } else {
                    activity.minPrice = activity.minPrice * conversionRate;
                    activity.maxPrice = activity.maxPrice * conversionRate;
                }
                return activity;
            });

            res.status(200).json(activities);
            break;
        case "category":
            activities = await activityModel.find({ categoryID: categoryID });
            if (!activities) {
                return res.status(404).json({ message: 'Activities not found' });
            }
            //change price to preferred currency
            activities = activities.map(activity => {
                if (activity.priceType === 'fixed') {
                    activity.price = activity.price * conversionRate;
                } else {
                    activity.minPrice = activity.minPrice * conversionRate;
                    activity.maxPrice = activity.maxPrice * conversionRate;
                }
                return activity;
            });
            res.status(200).json(activities);
            break;
        case "tag":
            activities = await activityModel.find({ tags: { $in: [tagID] } }).populate('advertiserID categoryID tags');
            if (!activities) {
                return res.status(404).json({ message: 'Activities not found' });
            }
            //change price to preferred currency
            activities = activities.map(activity => {
                if (activity.priceType === 'fixed') {
                    activity.price = activity.price * conversionRate;
                } else {
                    activity.minPrice = activity.minPrice * conversionRate;
                    activity.maxPrice = activity.maxPrice * conversionRate;
                }
                return activity;
            });
            res.status(200).json(activities);
            break;
        default:
            break;
    }
}

// @desc Get all upcoming activities
// @route GET /api/activity/upcoming
export const getUpcomingActivities = async (req, res) => {
    try {
        const prefCurrency = req.query.currency;
        const conversionRate = await getConversionRate(prefCurrency);
        const today = new Date();
        console.log(today)
        const activities = await activityModel.find({ date: { $gte: today } }).populate('advertiserID categoryID tags');

        //change price to preferred currency
        activities = activities.map(activity => {
            if (activity.priceType === 'fixed') {
                activity.price = activity.price * conversionRate;
            } else {
                activity.minPrice = activity.minPrice * conversionRate;
                activity.maxPrice = activity.maxPrice * conversionRate;
            }
            return activity;
        });

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
    const { tags, name, budgetMin, budgetMax, category, sortPrice, sortRating, rating, dateMin, dateMax } = req.body;

    console.log(req.body)
    let query = {};

    if (budgetMin && budgetMax) {
        query.$or = [
            { $and: [{ priceType: 'fixed' }, { price: { $gte: budgetMin, $lte: budgetMax } }] },
            { $and: [{ priceType: 'range', minPrice: { $gte: budgetMin, $lte: budgetMax } }] },
            { $and: [{ priceType: 'range', maxPrice: { $gte: budgetMin, $lte: budgetMax } }] },
        ];
    }
    if (dateMin && dateMax) {
        query.date = { $gte: new Date(dateMin), $lte: new Date(dateMax) };
    }
    if (category) {
        const categoryID = await activityCategory.findOne({ name: category })
        query.categoryID = categoryID._id;
    }
    if (name) {
        query.name = { $regex: name, $options: 'i' };
    }
    if (rating) {
        query['ratings.averageRating'] = { $gte: rating };
    }
    if (tags) {
        let tagsIDs = [];
        let flag = false;
        for (let i = 0; i < tags.length; i++) {
            const tag = await activityTag.findOne({ name: tags[i] });
            tagsIDs.push(tag._id);
            flag = true;
        }
        console.log(tagsIDs)
        if (flag)
            query.tags = { $in: tagsIDs }; // This checks if any of the tagIDs in 'tags' array is in the 'tags' field of activity
    }
    try {
        if (sortPrice || sortRating) {
            if (sortPrice != 0 || sortRating != 0) {
                let sortOptions = {};
                if (sortPrice != undefined && sortPrice != 0) {
                    sortOptions.normalizedPrice = sortPrice;
                }
                if (sortRating != undefined && sortRating != 0) {
                    sortOptions['ratings.averageRating'] = sortRating;
                }
                console.log("dakhal sort")
                console.log(query)
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
                        $sort: sortOptions
                    }
                ]).exec();
                //console.log(activities);
                console.log("dakhal sort")
                console.log(activities)
                return res.status(200).json(activities);
            }
        }
        else {
            const activities = await activityModel.find(query).populate('advertiserID categoryID tags');
            console.log(query)
            //console.log(activities)
            return res.status(200).json(activities);
        }
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getMyActivities = async (req, res) => {
    const id = req.params.id;
    try {
        const activities = await activityModel.find({ advertiserID: id }).populate('advertiserID categoryID tags');
        if (activities.lemgth === 0) {
            return res.status(404).json({ message: 'No activities found' });
        }
        return res.status(200).json(activities);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const viewSingleActivity = async (req, res) => {
    const id = req.params.id;
    const prefCurrency = req.query.currency;
    try {
        const activity = await activityModel.findById(id).populate('advertiserID categoryID tags');
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        return res.status(200).json(activity);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}