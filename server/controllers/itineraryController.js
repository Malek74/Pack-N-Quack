import Itinerary from '../models/itinerarySchema.js';
import itineraryTags from '../models/itineraryTagsSchema.js';
import product from '../models/productSchema.js';
import Tourist from '../models/touristSchema.js';
import { addLoyaltyPoints } from '../utils/Helpers.js';
import Stripe from 'stripe';
import Booking from "../models/bookingSchema.js";
import { uploadImages } from '../utils/Helpers.js';
import activityTag from '../models/activityTagSchema.js';
import { getConversionRate } from '../utils/Helpers.js';
import cloudinary from '../utils/cloudinary.js';
import { io } from '../server.js';
import Notification from '../models/norificationSchema.js';
import transactionModel from '../models/transactionsSchema.js';


//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {
    //fetch data from request body
    const tourGuideID = req.body.tourGuideID;
    const name = req.body.name;
    const { language, price, accessibility, tags, description, available_dates } = req.body;
    const days = JSON.parse(req.body.days);
    const pickUpLocation = JSON.parse(req.body.pickUpLocation);
    const dropOffLocation = JSON.parse(req.body.dropOffLocation);
    const { images, coverImage, activityImages } = req.files;
    let tagsIDS = []
    //validate that all fields are present
    console.log(req.body)
    if (!tourGuideID || !name || !days || !language || !price || !available_dates || !tags || !pickUpLocation || !dropOffLocation || !accessibility) {
        if (!name) {
            return res.status(400).json({ "message": "Name is missing" });
        }
        if (!tourGuideID) {
            return res.status(400).json({ "message": "TourGuideID is missing" });
        }
        if (!days) {
            return res.status(400).json({ "message": "Activities is missing" });
        }
        if (!language) {
            return res.status(400).json({ "message": "Language is missing" });
        }
        if (!price) {
            return res.status(400).json({ "message": "Price is missing" });
        }
        //console.log(available_dates)
        if (!available_dates) {
            return res.status(400).json({ "message": "Available dates is missing" });
        }
        console.log(pickUpLocation)
        if (!pickUpLocation) {
            return res.status(400).json({ "message": "Pick up location is missing" });
        }
        if (!dropOffLocation) {
            return res.status(400).json({ "message": "Drop off location is missing" });
        }
        if (!accessibility) {
            return res.status(400).json({ "message": "Accessibility is missing" });
        }
        if (!tags) {
            return res.status(400).json({ "message": "Tags is missing" });
        }
        if (!description) {
            return res.status(400).json({ "message": "Description is missing" });
        }

    }

    for (let i = 0; i < tags.length; i++) {
        const tag = await itineraryTags.findOne({ tag: tags[i] });
        if (tag) {
            tagsIDS.push(tag._id);
        }
    }

    try {
        //create product on stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const productStripe = await stripe.products.create({
            name: name,
            description: description,
            default_price_data: {
                currency: "usd",
                unit_amount: price * 100,
            },
        });
        let coverImageUrl = "";
        if (coverImage) {
            const uploadResult = await uploadImages(coverImage);
            console.log(uploadResult)
            if (uploadResult.success) {
                coverImageUrl = uploadResult.urls[0];
            } else {
                return res.status(400).json({ message: imagesUrls.message });
            }
        }

        let imagesUrls = []
        if (images) {
            const uploadResult = await uploadImages(images);
            if (uploadResult.success) {
                imagesUrls = uploadResult.urls;
            } else {
                return res.status(400).json({ message: uploadResult.message });
            }
        }
        let updatedDays = {}
        if (activityImages) {
            const activityImagesUrls = (await uploadImages(activityImages)).urls

            let activityCount = 0;

            updatedDays = days.map(day => {
                return {
                    ...day,
                    activities: day.activities.map(activity => {
                        // Replace the image attribute with the next URL from the array
                        const updatedActivity = {
                            ...activity,
                            image: activityImagesUrls[activityCount],
                        };
                        // Increment the URL index, wrapping around if necessary
                        activityCount++;
                        return updatedActivity;
                    })
                };
            });
        }

        const itinerary = new Itinerary({
            stripeID: productStripe.id,
            name: name,
            tourGuideID: tourGuideID,
            days: updatedDays,
            language: language,
            price: price,
            available_dates: (available_dates.filter(date => date !== "")),
            pickUpLocation: pickUpLocation,
            dropOffLocation: dropOffLocation,
            accessibility: accessibility,
            tags: tagsIDS,
            description: description,
            isActive: true,
            images: imagesUrls,
            coverImage: coverImageUrl,
            flagged: false,
        });
        const createdItinerary = await Itinerary.create(itinerary);

        return res.status(201).json(createdItinerary);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }

};


export const getItinerary = async (req, res) => {

    const name = req.query.name;
    const tags = req.query.tags;
    const maxBudget = req.query.maxBudget;
    const minBudget = req.query.minBudget;
    const minDate = req.query.minDate;
    const maxDate = req.query.maxDate;
    const language = req.query.language;

    const sortBy = req.query.sortBy;
    const order = req.query.order;

    console.log(req.query);

    let query = {};
    let sortOptions = {};

    // Only fetch active itineraries
    //query.isActive = true;
    let conversionRate;
    const currency = req.query.currency;

    try {
        console.log(query);
        if (currency) {
            conversionRate = await getConversionRate(currency);
        }

        // Build query based on input parameters
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Filter by name if provided
        }
        if (tags) {
            if (tags && tags.length > 0) {
                // Find all tag IDs based on the tag names provided
                const tagIDs = await itineraryTags.find({ tag: { $in: tags } }).select('_id');

                if (tagIDs.length > 0) {
                    // Use $in to filter itineraries with any of these tags
                    query.tags = { $in: tagIDs.map(tag => tag._id) };
                }
            }
        }

        if (minBudget || maxBudget) {
            query.price = {};
            if (minBudget) {
                query.price.$gte = minBudget;
            }
            if (maxBudget) {
                query.price.$lte = maxBudget;
            }
        }

        if (minDate || maxDate) {
            query.available_dates = { $elemMatch: {} };
            if (minDate) {
                query.available_dates.$elemMatch.$gte = new Date(minDate);
            }
            if (maxDate) {
                query.available_dates.$elemMatch.$lte = new Date(maxDate);
            }
        }
        if (language && language !== 'undefined') {
            query.language = language; // Filter by language if provided
        }

        // Set sorting options if provided
        if (sortBy && order && order !== 'undefined' && sortBy !== 'undefined') {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        query.isActive = true;
        query.flagged = false;
        // Fetch itineraries with filters and sort options
        let itineraries = await Itinerary.find(query).sort(sortOptions).populate('tags tourGuideID');
        console.log(itineraries)
        if (itineraries.length === 0) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        if (conversionRate) {
            itineraries = itineraries.map(itinerary => {
                itinerary.price = itinerary.price * conversionRate;
                return itinerary;
            });
        }
        return res.status(200).json(itineraries);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminItineraries = async (req, res) => {
    try {
        let itineraries = await Itinerary.find({}).populate('tags tourGuideID');
        console.log(itineraries)
        if (itineraries.length === 0) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        return res.status(200).json(itineraries);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//@desc get all itineraries
//@route GET api/itinerary
export const getMyItineraries = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const currency = req.query.currency
    let conversionRate = 0;
    let itineraries
    try {
        if (currency) {
            conversionRate = await getConversionRate(currency);
        }

        itineraries = await Itinerary.find({
            tourGuideID: id,
        }).populate('tags tourGuideID');

        if (!itineraries) {
            return res.status(404).json({ message: "No itineraries found" });
        }

        if (conversionRate) {
            itineraries = itineraries.map(itinerary => {
                itinerary.price = itinerary.price * conversionRate;
                return itinerary;
            });
        }

        res.status(200).json(itineraries);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const deleteItinerary = async (req, res) => {
    try {
        var itineraryToDelete = await Itinerary.findById(req.params.id);

        if (!itineraryToDelete) {
            return res.status(404).json({ message: "No itineraries found" });
        }

        const numsOfBookings = await Booking.find({ itineraryID: req.params.id });
        console.log(numsOfBookings);
        if (numsOfBookings.length != 0) {
            return res.status(404).json({ message: "Cannot delete itinerary with bookings" })
        }

        itineraryToDelete = await Itinerary.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "itinerary deleted" + itineraryToDelete });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: error.message });

    }
}

export const getItineraryById = async (req, res) => {
    const id = req.params.id;
    const currency = req.query.currency;

    if (!id) {
        return res.status(400).json({ message: "Itinerary ID is required." });
    }
    try {

        const itinerary = await Itinerary.findById(id).populate("tags tourGuideID");
        if (currency) {
            const conversionRate = await getConversionRate(currency);
            itinerary.price = itinerary.price * conversionRate;

        }
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found ." });
        }
        // if (itinerary.flagged === true) {
        //     return res.status(404).json({ message: "Itinerary is flagged." });
        // }

        return res.status(200).json(itinerary);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


export const getMaxPrice = async (req, res) => {
    try {
        const result = await Itinerary.aggregate([
            // {
            //     $match: { flagged: false } 
            // },
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" }
                }
            }
        ]);

        // Extract the max price, defaulting to 0 if no results were found
        const maxPrice = result[0]?.maxPrice || 0;

        return res.status(200).json(maxPrice);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const getAllLanguages = async (req, res) => {
    try {
        // Fetch distinct languages from itineraries where flagged is false
        //const languages = await Itinerary.distinct("language", { flagged: false });
        const languages = await Itinerary.distinct("language");


        return res.status(200).json(languages);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const toggleItineraryActive = async (req, res) => {
    const itineraryID = req.params.id;
    const { isActive } = req.body;
    try {
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { isActive: isActive } }, { new: true, runValidators: true });
        return res.status(200).json({ message: "Itinerary status updated.", itinerary: updatedItinerary });
    } catch (error) {
        return res.status(500).json({ message: "Error updating itinerary status", error: error.message });
    }
};



export const updateItinerary = async (req, res) => {
    const itineraryID = req.params.id;

    const { name, language, price, available_dates, accessibility, isActive, images, activityImages, tags, description, newActivityImageIndex } = req.body;
    const days = JSON.parse(req.body.days);
    const pickUpLocation = JSON.parse(req.body.pickUpLocation);
    const dropOffLocation = JSON.parse(req.body.dropOffLocation);
    //console.log(req.files);

    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itineraries found " + itinerary });
        }

        const numsOfBookings = await Booking.find({ itineraryID: req.params.id });


        if (numsOfBookings.length != 0) {
            return res.status(404).json({ message: "Cannot update itinerary with bookings" })
        }
        let newImages = [];

        const imagesToUpload = req.files['images'];

        if (imagesToUpload) {
            const imagesUrls = await uploadImages(imagesToUpload);
            if (imagesUrls.success) {
                newImages.push(...images);
                newImages.push(...imagesUrls.urls);
            } else {
                return res.status(400).json({ message: imagesUrls.message });
            }
        }

        let newActivityImages = [];
        let updatedDays = {}
        const activityImagesToUpload = req.files['activityImages'];
        console.log(activityImages)
        if (activityImagesToUpload) {
            const imagesUrls = await uploadImages(activityImagesToUpload);
            if (imagesUrls.success) {
                newActivityImages.push(...imagesUrls.urls);
            } else {
                return res.status(400).json({ message: imagesUrls.message });
            }
            const newActivityImagesIndex = newActivityImageIndex.filter(x => x !== "");
            let oldActivityCount = 0;
            let newActivityCount = 0;

            const oldActivityImagesUrls = activityImages != "" ? activityImages.filter(x => x !== "") : [];
            updatedDays = days.map((day, dayIndex) => {
                return {
                    ...day,
                    activities: day.activities.map((activity, activityIndex) => {
                        if (newActivityCount < newActivityImagesIndex.length) {
                            const [dIndex, aIndex] = newActivityImagesIndex[newActivityCount].split(",");

                            if (dIndex == dayIndex && aIndex == activityIndex) {
                                const newUpdatedActivity = {
                                    ...activity,
                                    image: newActivityImages[newActivityCount],
                                };
                                newActivityCount++;
                                console.log(newUpdatedActivity);
                                return newUpdatedActivity;
                            }
                        }
                        // Replace the image attribute with the next URL from the array
                        const oldUpdatedActivity = {
                            ...activity,
                            image: oldActivityImagesUrls[oldActivityCount],
                        };
                        // Increment the URL index, wrapping around if necessary
                        oldActivityCount++;
                        return oldUpdatedActivity;

                    })
                };
            });
        }

        let newCoverImage = "";
        if (req.files['coverImage']) {
            const coverImageToUpload = req.files['coverImage'];
            const coverImageUrl = await uploadImages(coverImageToUpload);
            console.log(coverImageUrl);
            console.log("HENA");
            if (coverImageUrl.success) {
                newCoverImage = coverImageUrl.urls[0];
            } else {
                return res.status(400).json({ message: coverImageUrl.message });
            }
            console.log(newCoverImage);
        }
        let tagsIDS = []
        const tagsArray = tags.filter(tag => tag !== "");
        for (let i = 0; i < tagsArray.length; i++) {
            const tag = await itineraryTags.findOne({ tag: tagsArray[i] });
            if (tag) {
                tagsIDS.push(tag._id);
            }
        }

        const updatedFields = {};
        if (name) updatedFields.name = req.body.name;
        if (days) updatedFields.days = activityImagesToUpload ? updatedDays : days;
        if (language) updatedFields.language = req.body.language;
        if (price) updatedFields.price = req.body.price;
        if (available_dates) updatedFields.available_dates = (req.body.available_dates).filter(date => date !== "");
        if (pickUpLocation) updatedFields.pickUpLocation = JSON.parse(req.body.pickUpLocation);
        if (dropOffLocation) updatedFields.dropOffLocation = JSON.parse(req.body.dropOffLocation);
        if (accessibility) updatedFields.accessibility = req.body.accessibility;
        if (newImages.length != 0) updatedFields.images = newImages.filter(image => image !== "");
        if (activityImages) updatedFields.activityImages = activityImages.filter(image => image !== "");
        if (tags) updatedFields.tags = tagsIDS;
        if (newCoverImage != "") updatedFields.coverImage = newCoverImage;
        if (description) updatedFields.description = description;


        if (itinerary.bookings == 0 & isActive == false) {
            return res.status(404).json({ message: "Cannot deactivate an itinerary with no bookings" + itinerary });
        }
        else if (itinerary.isActive == false & isActive == true) {
            return res.status(404).json({ message: "Cannot activate a deactivated booking " + itinerary });
        }
        else {
            updatedFields.isActive = req.body.isActive;
        }

        // Save the itinerary with the updated fields and isActive status
        // Update the itinerary using the updatedFields object
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { ...updatedFields } }, { new: true, runValidators: true });

        // Send the updated itinerary back in the response
        return res.status(200).json(updatedItinerary);


    } catch (error) {
        res.status(401).json({ message: "Itinerary doesn't exist:" + error.message });
        console.log(error);
    }


}

export const addActivity = async (req, res) => {
    const itineraryID = req.params.id;
    const { newActivities } = req.body;
    console.log("This is the body" + req.body)

    try {
        //fetch itinerary
        const itinerary = await Itinerary.findById(itineraryID);

        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { days: req.body } }, { new: true, runValidators: true });
        console.log(updatedItinerary.days);
        res.status(200).json(updatedItinerary);
    } catch (error) {
        res.status(401).json({ message: "itinerary deosn't exist:" + error.message });
        console.log(error);
    }
}

export const Flagg = async (req, res) => {
    const itineraryID = req.params.id;
    const flag = req.body.flag;

    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itinerary found with ID " + itineraryID });
        }

        if (flag === false && itinerary.flagged === true) {
            return res.status(400).json({ message: "Cannot unflag an already flagged itinerary" });
        }

        //flag itinerary
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { flagged: flag } }, { new: true, runValidators: true });

        let isbooked = await Booking.find({ itineraryID: itineraryID });
        if (isbooked.length > 0) {
            if (flag == true) {
                for (let i = 0; i < isbooked.length; i++) {
                    const user = await Tourist.findById(isbooked[i].touristID);
                    if (user) {
                        //update wallet in user
                        const updatedUser = await Tourist.findByIdAndUpdate(user._id, { $set: { wallet: user.wallet + itinerary.price } }, { new: true, runValidators: true });

                        //create a transaction 
                        const transaction = new transactionModel({
                            amount: itinerary.price,
                            incoming: true,
                            userId: user._id,
                            title: "Itinerary Refund",
                            description: "Refund for flagged itinerary",
                            method: "wallet"
                        });

                    }
                }
            }
        }

        //create new notification for the tour guide
        const notification = await Notification.create({
            title: "Itinerary flagged",
            message: `Your itinerary ${itinerary.name} has been flagged`,
            user: {
                id: itinerary.tourGuideID,
                role: "TourGuide"
            }
        });

        io.emit("flaggedItinerary", notification);

        return res.status(200).json(updatedItinerary);

    } catch (error) {
        res.status(500).json({ message: "Error updating itinerary: " + error.message });
        console.log(error);
    }
};

export const rateIternary = async (req, res) => {
    const { touristId, rating, comment } = req.body;
    const itineraryId = req.params.id;
    if (!itineraryId) {
        return res.status(400).json({ message: "Itinerary ID is required." });
    }
    if (!touristId) {
        return res.status(400).json({ message: "Tourist ID is required." });
    }
    if (!rating) {
        return res.status(400).json({ message: "Rating is required." });
    }

    try {
        const itinerary = await Itinerary.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        let averageRating = itinerary.ratings.averageRating;
        let noOfReviews = itinerary.ratings.reviews.length;
        averageRating += (rating) / (noOfReviews + 1);
        const review = { touristId, rating, comment };

        await Itinerary.findByIdAndUpdate(itineraryId, { $push: { "ratings.reviews": review } });
        const newItinerary = await Itinerary.findByIdAndUpdate(itineraryId, { "ratings.averageRating": averageRating });
        return res.status(200).json(newItinerary);
    }
    catch (error) {
        return res.status(404).json({ message: error.message });
    }
}



export const addCoverImageToItinerary = async (req, res) => {
    const itineraryID = req.params.id;
    const image = req.files['images'];

    const itinerary = await Itinerary.findById(itineraryID);

    if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
    }

    try {
        const uploadResult = await uploadImages(image);
        if (uploadResult.success) {
            const newItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { coverImage: uploadResult.urls[0] }, { new: true });
            return res.status(200).json({ message: "Image uploaded successfully", newItinerary });
        }
        return res.status(400).json({ message: uploadResult.message });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addImagesToActivity = async (req, res) => {
    const itineraryID = req.params.id;
    // console.log(req.body);
    const { dayNo, activityNo } = req.body;
    const images = req.files['images'];
    // console.log(images);

    const itinerary = await Itinerary.findById(itineraryID);

    if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
    }

    try {
        const uploadResult = await uploadImages(images);
        console.log(uploadResult.success);
        if (uploadResult.success) {
            const newItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { [`days.${dayNo}.activities.${activityNo}.image`]: uploadResult.urls[0] } }, { new: true });
            console.log(newItinerary);
            return res.status(200).json({ message: "Images uploaded successfully", newItinerary });
        }

        return res.status(400).json({ message: "message" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const addImagesToItinerary = async (req, res) => {
    const itineraryID = req.params.id;
    const images = req.files['images'];

    const itinerary = await Itinerary.findById(itineraryID);

    if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
    }

    try {
        const uploadResult = await uploadImages(images);
        if (uploadResult.success) {
            const newItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: { images: uploadResult.urls } }, { new: true });
            return res.status(400).json(newItinerary);
        }
        return res.status(400).json({ message: uploadResult.message });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}