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
// export const searchActivity = async (req, res) => {
//     const searchBy = req.body.searchBy; // name, category, tag
//     const name = req.body.name;
//     const categoryID = req.body.categoryID;
//     const tagID = req.body.tagID;
//     let a;
    
//     switch (searchBy) {
//         case "name":
//             a = await activityModel.find({ name: name });
//             if (!a) {
//                 return res.status(404).json({ message: 'Activity not found' });
//             }
//             res.status(200).json(a);
//             break;
//         case "category":
//             a = await activityModel.find({ categoryID: categoryID });
//             if (!a) {
//                 return res.status(404).json({ message: 'Activities not found' });
//             }
//             res.status(200).json(a);
//             break;
//         case "tag":
//             a = await activityModel.find({ tags: { $in: [tagID] } }).populate('advertiserID categoryID tags');
//             if (!a) {
//                 return res.status(404).json({ message: 'Activities not found' });
//             }
//             a = a.filter(activity => activity.flagged === false);
//             res.status(200).json(a);
//             break;
//         default:
//             break;
//     }
// }

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
                
        activities = activities.filter(activity => !activity.flagged);

        if (activities.length === 0) {
            return res.status(404).json({ message: 'Activities not found' });
        }


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
        let today = new Date(); 
        console.log("Today's date:", today);

        // Use let instead of const for reassigning the activities variable
        let activities = await activityModel.find({ 
            date: { $gte: today }, 
            // flagged: false,
        }).populate('advertiserID categoryID tags');

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


        
        console.log("Fetched Activities:", activities);

        // Check if activities are empty
        if (activities.length === 0) {
            console.log("No upcoming activities found.");
        }
        activities = activities.filter(activity => !activity.flagged);
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching upcoming activities:", error);
        res.status(404).json({ message: error.message });
    }
}


// @desc Post a review
// @route POST /api/activity/review
// @params id of activity
// @Body { touristID, review, rating }
export const postReview = async (req, res) => {
    const id = req.params.id;
    const { touristID, comment, rating } = req.body;
    try {
        const activity = await activityModel.findById(id);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        if (activity.flagged)
        {
            return res.status(404).json({ message: 'Activity is flagged' });
        }
        activity.ratings.reviews.push({ touristID, comment, rating });
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

    console.log("Request body:", req.body);
    let query = { }; 

    // Handle budget filtering
    if (budgetMin !== undefined && budgetMax !== undefined) {
        query.$or = [
            { $and: [{ priceType: 'fixed' }, { price: { $gte: budgetMin, $lte: budgetMax } }] },
            { $and: [{ priceType: 'range', minPrice: { $gte: budgetMin } }, { maxPrice: { $lte: budgetMax } }] }
        ];
    }

    // Handle date filtering
    if (dateMin && dateMax) {
        query.date = { $gte: new Date(dateMin), $lte: new Date(dateMax) };
    }

    // Handle category filtering
    if (category) {
        const categoryID = await activityCategory.findOne({ name: category });
        if (categoryID) {
            query.categoryID = categoryID._id;
        }
    }

    // Handle name filtering
    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Handle rating filtering
    if (rating) {
        query['ratings.averageRating'] = { $gte: rating };
    }

    // Handle tag filtering
    if (tags && tags.length > 0) {
        const tagIDs = await Promise.all(tags.map(tag => activityTag.findOne({ name: tag }).then(tagDoc => tagDoc ? tagDoc._id : null)));
        const filteredTagIDs = tagIDs.filter(id => id); // Remove nulls
        if (filteredTagIDs.length > 0) {
            query.tags = { $in: filteredTagIDs }; // Match activities with any of the tagIDs
        }
    }

    try {
        let activities;
        
        // Sort and fetch activities based on specified criteria
        if (sortPrice || sortRating) {
            const sortOptions = {};
            if (sortPrice) sortOptions.normalizedPrice = sortPrice;
            if (sortRating) sortOptions['ratings.averageRating'] = sortRating;

            activities = await activityModel.aggregate([
                { $match: query },
                {
                    $addFields: {
                        normalizedPrice: {
                            $cond: {
                                if: { $eq: ["$priceType", "fixed"] },
                                then: "$price",
                                else: { $avg: ["$minPrice", "$maxPrice"] } // Use average for range pricing
                            }
                        }
                    }
                },
                { $sort: sortOptions }
            ]).exec();
        } else {
            activities = await activityModel.find(query).populate('advertiserID categoryID tags');
        }
        activities = activities.filter(activity => !activity.flagged);
        console.log("Filtered and sorted activities:", activities);
        return res.status(200).json(activities);
    } catch (error) {
        console.error("Error in filtering activities:", error);
        return res.status(404).json({ message: error.message });
    }
};

export const getMyActivities = async (req, res) => {
    const id = req.params.id;
    try {
        const activities = await activityModel.find({ advertiserID: id,flagged:false }).populate('advertiserID categoryID tags');
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

export const Flagg = async (req, res) => {
    const activityID = req.params.id;
    const flagger = req.body.flagger; 

    try {
        let activity = await activity.findById(activityID);

        if (!activity) {
            return res.status(404).json({ message: "No activity found with ID " + activityID });
        }

        
        if (flagger === false && activity.flagged === true) {
            return res.status(400).json({ message: "Cannot unflag an already flagged activity" });
        } else {
            activity.flagged = flagger; 
            await activity.save();     
        }

        res.status(200).json(activity);

    } catch (error) {
        res.status(500).json({ message: "Error updating activity: " + error.message });
        console.log(error);
    }
};