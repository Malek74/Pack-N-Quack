import activityModel from "../models/activitySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import { usernameExists, emailExists } from "../utils/Helpers.js";
import DeleteRequest from "../models/deleteRequests.js";
import Booking from "../models/bookingSchema.js";
import mongoose from "mongoose";

export const addAdvertiser = async (req, res) => {
    const { email, username, password } = req.body;

    const doesEmailExists = await emailExists(email);
    if (doesEmailExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const doesUsernameExists = await usernameExists(username);
    if (doesUsernameExists) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const newAdvertiser = new advertiserModel({ email, username, password });
    try {
        const advertiser = await newAdvertiser.save();
        return res.status(200).json(advertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getAdvertisers = async (req, res) => {
    try {
        const advertisers = await advertiserModel.find({});
        return res.status(200).json(advertisers);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

// @desc Get a single advertiser
// @route GET /api/advertisers/:id
// @params id of advertiser
export const getAdvertiser = async (req, res) => {
    const id = req.params.id;
    try {
        const advertiser = await advertiserModel.findById(id);
        res.status(200).json(advertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Delete an advertiser
// @route DELETE /api/advertisers/delete/:id
// @params id of advertiser
export const deleteAdvertiser = async (req, res) => {
    const id = req.params.id;
    try {

        const upcomingActivities = await activityModel.find({ advertiserID: id, date: { $gte: new Date() } });

        for (let i = 0; i < upcomingActivities.length; i++) {
            const bookings = await Booking.find({ activityID: upcomingActivities[i]._id });
            if (bookings.length > 0) {
                return res.status(400).json({ message: "Account cannot be deleted because it has active bookings" });
            }
        }

        const activitiesByAdvertiser = await activityModel.deleteMany({ advertiserID: id });


        console.log(activitiesByAdvertiser.deletedCount, 'activities deleted');
        const deletedAdvertiser = await advertiserModel.findByIdAndDelete(id);
        res.status(200).json(deletedAdvertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Update an advertiser
// @route PUT /api/advertisers/edit/:id
// @params id of advertiser
// @Body { companyName, email, username, password, website, hotline, establishmentDate, description, isAccepted }
export const updateAdvertiser = async (req, res) => {
    const id = req.params.id;
    if (req.body.email != req.body.oldEmail) {
        const doesEmailExists = await emailExists(req.body.email);
        if (doesEmailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }
    }
    try {
        const updatedAdvertiser = await advertiserModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedAdvertiser);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

// @desc Get created activities of advertiser
// @route GET /api/advertisers/activities/:id
// @params id of advertiser
export const getAdvertiserActivities = async (req, res) => {
    const id = req.params.id;
    try {
        const activities = await activityModel.find({ advertiserID: id }).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const acceptTerms = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.status(400).json({ message: "Advertiser ID is required." });
    }
    try {
        const advertiser = await advertiserModel.findById(id);
        if (!advertiser) {
            return res.status(404).json({ message: "Advertiser not found." });
        }
        const newAdvertiser = await advertiserModel.findByIdAndUpdate(id, { hasAcceptedTerms: true }, { new: true })
        return res.status(200).json(newAdvertiser);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getBookingCount = async (req, res) => {
    const id = req.params.id;
        const { 
        date,       // Specific date in YYYY-MM-DD format
        month,      // Specific month in YYYY-MM format
        activityId  // Specific activity ID to filter
    } = req.query;

    try {

        let activityIds = (await activityModel.find({ advertiserID: id, date: { $lte: new Date() } })).map(activity => activity._id.toString());

        let activityQuery = { 
            advertiserID: id, 
            date: { $lte: new Date() } 
        };

        // If a specific activity is provided, add it to the activity query
        if (activityId) {
            activityIds = [activityId];
        }


        // Prepare the match stage for bookings
        const matchStage = {
            activityID: { $in: activityIds.map(id => new mongoose.Types.ObjectId(id)) }
        };

        // Add date filtering if a specific date is provided
        if (date) {
            matchStage.createdAt = {
                $gte: new Date(date),
                $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
            };
        }

        // Add month filtering if a specific month is provided
        if (month) {
            const startOfMonth = new Date(month + '-01');
            const endOfMonth = new Date(startOfMonth);
            endOfMonth.setMonth(endOfMonth.getMonth() + 1);

            matchStage.createdAt = {
                $gte: startOfMonth,
                $lt: endOfMonth
            };
        }

        const bookings = await Booking.find({ activityID: { $in: activityIds } }).select('_id activityID createdAt');

        const results = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: {
                        activityID: "$activityID",
                        creationDay: { $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$createdAt"
                            // timezone: "UTC"
                        } }
                    },
                    count: { $sum: 1 },
                    totalPrice: { $sum: "$price" } // Sum the price
                }
            },
            {
                $project: {
                    _id: 0,
                    activityID: "$_id.activityID",
                    creationDay: "$_id.creationDay",
                    count: 1,
                    totalPrice: 1,
                    totalRevenue: { $multiply: ["$totalPrice", 0.9] } // Multiply count by price
                }
            },
            {
                $sort: { creationDay: 1 }
            }
        ]);

        console.log(results);


        // for (const booking of bookings) {
        //     const activityId = booking.activityID.toString();
        //     const creationDay = booking.createdAt.toISOString().split('T')[0]; // Extract the creation day (YYYY-MM-DD)

        //     // Count the documents where activityID matches
        //     const count = await Booking.countDocuments({ activityID: activityId });

        // if (!results[activityId]) {
        //     results[activityId] = [];
        // }

        //     results.push({
        //          bookingId: booking._id.toString(),
        //         creationDay,
        //         count,
        //     });
        // }

        // console.log(results);

        res.status(200).json(results);
    
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
