import tourGuide from '../models/tourGuideSchema.js';
import { usernameExists, emailExists, deleteIteneraries } from '../utils/Helpers.js';
import Document from '../models/documentSchema.js';
import DeleteRequest from '../models/deleteRequests.js';
import Itinerary from '../models/itinerarySchema.js';
import Booking from '../models/bookingSchema.js';
import bcrypt from "bcrypt";
import { createToken } from "../utils/Helpers.js";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';    

//@desc Create a new tour guide
//@route POST /api/tourGuide
//@access Public
export const createTourGuide = async (req, res) => {
    const { email, username, password } = req.body;

    const tourGuideExists = await emailExists(email);

    // Check if all required fields are present
    if (!email || !username || !password) {
        return res.status(400).json({ message: "Email, username, and password are required." });
    }

    //check user name is unique across all users
    if (await usernameExists(username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    //check email is unique across all users
    if (tourGuideExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    try {
        const salt = await bcrypt.genSalt(); //generate salt to randomise the password hash (distinct between users with the same password)
        const hashedPassword = await bcrypt.hash(password, salt);


        const newTourGuide = await tourGuide.create({ email: email, username, password: hashedPassword });

        //create a token for the user
        const token = createToken(username, newTourGuide._id, "Tour Guide");

        //send the token in the response
        res.cookie("jwt", token, { httpOnly: true });

        return res.status(201).json(newTourGuide);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

//@desc Get all tour guides
//@route GET /api/tourGuide
export const getTourGuides = async (req, res) => {
    try {
        const tourGuides = await tourGuide.find();
        res.status(200).json(tourGuides);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getTourGuideById = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    if (!id) {
        return res.status(400).json({ message: "Tour Guide ID is required." });
    }

    try {
        const tourGuideExists = await tourGuide.findById(id);

        if (!tourGuideExists) {
            return res.status(404).json({ message: "Tour Guide not found." });
        }
        return res.status(200).json(tourGuideExists);

    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

//@desc edit a tour guide
//@route PUT /api/tourGuide/:id
//@access Public
export const editTourGuide = async (req, res) => {
    try {
        const id = req.user._id;
        const { email, mobile, experienceYears, previousWork, isAccepted, oldEmail } = req.body;
        console.log(req.body)
        if (email) {
            if (email != oldEmail) {
                if (await emailExists(email)) {
                    return res.status(400).json({ message: "Email already exists" });
                }
            }
        }
        // Create an object with the fields to update
        const updatedFields = {};
        if (mobile) updatedFields.mobile = mobile;
        if (experienceYears) updatedFields.experienceYears = experienceYears;
        if (previousWork) updatedFields.previousWork = previousWork;
        if (isAccepted) updatedFields.isAccepted = isAccepted;
        if (email) updatedFields.email = email;

        // Check if the tour guide exists
        let tourGuideEdited = await tourGuide.findById(id);

        if (!tourGuideEdited) {
            return res.status(404).json({ message: "Tour guide doesn't exist" });
        }

        // Update the tour guide
        tourGuideEdited = await tourGuide.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
        console.log(updatedFields);
        console.log(id);
        // Send the updated tour guide data
        res.status(200).json(tourGuideEdited);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const rateTourGuide = async (req, res) => {

    const { rating, comment } = req.body;
    const tourGuideId = req.params.id;
    const touristId = req.user._id;

    if (!tourGuideId) {
        return res.status(400).json({ message: "Tour Guide ID is required." });
    }
    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required." });
    }
    if (!rating) {
        return res.status(400).json({ message: "Rating is required." });
    }

    try {
        const ratedTourGuide = await tourGuide.findById(tourGuideId);
        if (!ratedTourGuide) {
            return res.status(404).json({ message: "Tour Guide not found." });
        }
        let averageRating = ratedTourGuide.ratings.averageRating;
        let noOfReviews = ratedTourGuide.ratings.reviews.length;
        averageRating += (rating) / (noOfReviews + 1);
        const review = {
            touristId: touristId,
            rating: rating,
            comment: comment,
        }
        await tourGuide.findByIdAndUpdate(tourGuideId, { $push: { 'ratings.reviews': review } });
        const newTourGuide = await tourGuide.findByIdAndUpdate(tourGuideId, { 'ratings.averageRating': averageRating });
        return res.status(200).json(newTourGuide);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
};

export const acceptTerms = async (req, res) => {
    const id = req.user._id;
    if (!id) {
        return res.status(400).json({ message: "Tour Guide ID is required." });
    }

    try {
        const updatedTourGuide = await tourGuide.findById(id);
        if (!updatedTourGuide) {
            return res.status(404).json({ message: "Tour Guide not found." });
        }

        const newTourGuide = await tourGuide.findByIdAndUpdate(id, { hasAcceptedTerms: true }, { new: true });

        return res.status(200).json(newTourGuide);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const deleteTourGuide = async (req, res) => {
    const id = req.user._id;
    if (!id) {
        return res.status(400).json({ message: "Tour Guide ID is required." });
    }
    try {
        //retrieve all itineraries of the tour guide that are active and not flagged and have dates in the future
        const myItineraries = await Itinerary.find({ tourGuideID: id, flagged: false, date: { $elemMatch: { $gte: new Date() } } });
        //check if any of theses itineraries have bookings
        for (let i = 0; i < myItineraries.length; i++) {

            const itirenaryBookings = await Booking.find({ itineraryID: myItineraries[i]._id, date: { $elemMatch: { $gte: new Date() } } });
            if (itirenaryBookings.length > 0) {
                const deleteRequest = await DeleteRequest.create({ tourGuideID: id, date: new Date(), status: "rejected" });
                return res.status(400).json({ message: "Account cannot be deleted because it has active bookings" });
            }
        }


        const deletedTourGuide = await tourGuide.findByIdAndDelete(id);
        if (!deletedTourGuide) {
            return res.status(404).json({ message: "Tour Guide not found." });
        }
        const deleteRequest = await DeleteRequest.create({ tourGuideID: id, date: new Date(), status: "accepted" });
        deleteIteneraries(id);
        return res.status(200).json({ message: "Tour Guide deleted successfully." });
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getRevenue = async (req, res) => {
    const id = req.user._id;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate || new Date();
    const itineraryId = req.query.itineraryId;

    if(!id) {
        return res.status(400).json({ message: "Tour Guide ID is required." });
    }

    if (startDate && !Date.parse(startDate)) {
        return res.status(400).json({ message: "Invalid start date." });
    }

    if(endDate && !Date.parse(endDate)) {
        return res.status(400).json({ message: "Invalid end date." });
    }

    if(itineraryId && !mongoose.Types.ObjectId.isValid(itineraryId)) {
        return res.status(400).json({ message: "Invalid itinerary ID." });
    }



    try {

        if(itineraryId && !(await Itinerary.findById(itineraryId))){
            return res.status(400).json({ message: "Activity not found." });
        }

        if(!await tourGuide.findById(id)) {
            return res.status(400).json({ message: "Advertiser not found." });
        }
    
        let itineraryIds = (await Itinerary.find({ tourGuideID: id, available_dates:{ $elemMatch: {$lte: new Date()} }})).map(activity => activity._id.toString());
        console.log(itineraryIds);

        let itineraryQuery = { 
            tourGuideID: id, 
            date: { $lte: new Date() } 
        };

        // If a specific activity is provided, add it to the activity query
        if (itineraryId) {
            itineraryIds = itineraryId;
        }


        // Prepare the match stage for bookings
        const matchStage = {
            itineraryID: { $in: itineraryIds.map(id => new mongoose.Types.ObjectId(id)) }
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

        console.log(matchStage);    

        const bookings = await Booking.find({ itineraryID: { $in: itineraryIds } }).select('_id itineraryID date');

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
                    Date: "$_id.creationDay",
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

        const revenueAndBookingsPerEvent = await Booking.aggregate([
            {
                $match: matchStage 
            },
            {
                $group: {
                    _id: {
                        itineraryID: "$itineraryID",
                    },
                    count: { $sum: 1 },
                    totalPrice: { $sum: "$price" },
                    numofTickets: { $sum: "$numOfTickets" } 
                }
            },
            {
                $lookup: {
                    from: 'itineraries',
                    localField: '_id.itineraryID',
                    foreignField: '_id',
                    as: 'activityDetails'
                }
            },
            {
                $unwind: '$activityDetails' // Deconstructs the array created by $lookup
            },
            {
                $project: {
                    _id: 0,
                    title: '$activityDetails.name',
                    revenue: { $multiply: ["$totalPrice", 0.9] }, 
                    bookings: "$numofTickets"
                }
            },

        ]);

        res.status(200).json({revenuePerDay: revenuePerDay, totalRevenue: totalRevenue[0], totalBookings: {activitiesBookings: totalBookings}, revenueAndBookingsPerEvent: revenueAndBookingsPerEvent});
    
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


