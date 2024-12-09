import activityModel from "../models/activitySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import { usernameExists, emailExists } from "../utils/Helpers.js";
import DeleteRequest from "../models/deleteRequests.js";
import Booking from "../models/bookingSchema.js";
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { getRevenue } from "./tourguideController.js";

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

    const salt = await bcrypt.genSalt(); //generate salt to randomise the password hash (distinct between users with the same password)
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdvertiser = new advertiserModel({ email, username, password: hashedPassword });

    //create a token for the user
    const token = createToken(username, newAdvertiser._id, "Advertiser");

    //send the token in the response
    res.cookie("jwt", token, { httpOnly: true });

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
    const id = req.user._id;
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
    const id = req.user._id;
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
    const id = req.user._id;
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
    const id = req.user._id;
    try {
        const activities = await activityModel.find({ advertiserID: id }).populate('advertiserID categoryID tags');
        res.status(200).json(activities);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const acceptTerms = async (req, res) => {
    const id = req.user._id;
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
    const id = req.user._id;
    // const id = req.params.id;
    const  startDate = req.query.startDate;
    const  endDate = req.query.endDate || new Date();
    const activityId = req.query.activityId;

    if(!id) {
        return res.status(400).json({ message: "Advertiser ID is required." });
    }

    if (startDate && !Date.parse(startDate)) {
        return res.status(400).json({ message: "Invalid start date." });
    }

    if(endDate && !Date.parse(endDate)) {
        return res.status(400).json({ message: "Invalid end date." });
    }

    if(activityId && !mongoose.Types.ObjectId.isValid(activityId)) {
        return res.status(400).json({ message: "Invalid activity ID." });
    }



    try {

        if(activityId && !(await activityModel.findById(activityId))){
            return res.status(400).json({ message: "Activity not found." });
        }

        if(!await advertiserModel.findById(id)) {
            return res.status(400).json({ message: "Advertiser not found." });
        }
    
        let activityIds = (await activityModel.find({ advertiserID: id, date: { $lte: new Date() } })).map(activity => activity._id.toString());

        let activityQuery = { 
            advertiserID: id, 
            date: { $lte: new Date() } 
        };

        // If a specific activity is provided, add it to the activity query
        if (activityId) {
            activityIds = activityId.split(',');
        }


        // Prepare the match stage for bookings
        const matchStage = {
            activityID: { $in: activityIds.map(id => new mongoose.Types.ObjectId(id)) }
        };

        // Add date filtering if a specific date is provided
        if(startDate){
            if(new Date(startDate) < new Date(endDate)){
                if(new Date(endDate) <= new Date()){
                    matchStage.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
                    console.log(matchStage.date);
                }
                else{
                    res.status(403).json({ message: "End date cannot be later than today's date" });
                }
            }
        }

        // console.log(matchStage);    

        const bookings = await Booking.find({ activityID: { $in: activityIds } }).select('_id activityID date');

        const revenuePerDay = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: {
                        creationDay: { $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$date"
                        } }
                    },
                    count: { $sum: 1 },
                    totalPrice: { $sum: "$price" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.creationDay",
                    revenue: { $multiply: ["$totalPrice", 0.9] }

                }
            },
            {
                $sort: { creationDay: 1 }
            }
        ]);

        const totalRevenue = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: null, 
                    totalPrice: { $sum: "$price" } 
                }
            },
            {
                $project: {
                    _id: 0,
                    activitiesRevenue: { $multiply: ["$totalPrice", 0.9] }
                }
            },
        ]);

        const totalBookings = await Booking.countDocuments(matchStage);

        const bookingsWithActivityDetails = await Booking.aggregate([
            {
                $match: matchStage // Filter bookings based on conditions in matchStage
            },
            {
                $lookup: {
                    from: "activities", // Reference the activities collection
                    localField: "activityID", // Field in bookings to match
                    foreignField: "_id", // Field in activities to match
                    as: "activityDetails" // Alias for the joined data
                }
            },
            {
                $unwind: "$activityDetails" // Unwind the activity details array
            },
            {
                $project: {
                    // _id: 1, // Keep the booking ID
                    price: 1, // Include the price of the booking
                    numOfTickets: 1, // Include the number of tickets (if needed)
                    activityName: "$activityDetails.name", // Include the activity name
                    date: 1 // Include the booking date (optional)
                }
            },
            {
                $sort: { date: 1 } // Optional: Sort by booking date
            }
        ]);
        

        res.status(200).json({revenuePerDay: revenuePerDay, totalRevenue: totalRevenue[0], totalBookings: {activitiesBookings: totalBookings}, revenueAndBookingsPerEvent: bookingsWithActivityDetails});
    
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
