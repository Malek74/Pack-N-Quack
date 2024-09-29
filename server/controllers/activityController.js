import activity from "../models/activitySchema.js";

// @desc Get all activities
// @route GET /api/activity
export const getActivities = async (req, res) => {
    try {
        const activities = await activity.find({});
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Add an activity
// @route POST /api/activity
// @Body { advertiserID, date, location, priceType, price, minPrice, maxPrice, category, tags, specialDiscounts, isBookingOpen, duration }
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