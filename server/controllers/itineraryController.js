import Itinerary from '../models/itinerarySchema.js';
import itineraryTags from '../models/itineraryTagsSchema.js';
import product from '../models/productSchema.js';
import tourist from '../models/touristSchema.js';
import { addLoyaltyPoints } from '../utils/Helpers.js';
import Stripe from 'stripe';
import Booking from "../models/bookingsSchema.js";
import { getConversionRate } from '../utils/Helpers.js';



//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {

    //fetch data from request body
    const tourGuideID = req.body.tourGuideID;
    const name = req.body.title;
    const available_dates = req.body.dates;
    const { days, language, price, pickUpLocation, dropOffLocation, accessibility, tags, description, isActive } = req.body;
    let tagsIDS = []
    console.log(req.body);
    //validate that all fields are present
    if (!tourGuideID || !name || !days || !language || !price || !available_dates || !tags || !pickUpLocation || !dropOffLocation || !accessibility || !isActive) {
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
        if (!available_dates) {
            return res.status(400).json({ "message": "Available dates is missing" });
        }
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
        if (!isActive) {
            return res.status(400).json({ "message": "Actiivity of itinerary is missing" });
        }
    }
    console.log(tags);

    for (let i = 0; i < tags.length; i++) {
        const tag = await itineraryTags.findOne({ tag: tags[i] });
        tagsIDS.push(tag._id);
    }

    console.log(tagsIDS);


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


        const itinerary = new Itinerary({
            stripeID: productStripe.id,
            name: name,
            tourGuideID: tourGuideID,
            days: days,
            language: language,
            price: price,
            available_dates: available_dates,
            pickUpLocation: pickUpLocation,
            dropOffLocation: dropOffLocation,
            accessibility: accessibility,
            tags: tagsIDS,
            description: description,
            isActive: isActive,
        });
        const createdItinerary = await Itinerary.create(itinerary);
        return res.status(201).json(createdItinerary);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }

};

//@desc get a single itinerary by id, category, or tag
//@route GET api/itinerary
// export const getItinerary = async (req, res) => {


//     const id = req.query.id;
//     const name = req.query.name;
//     const tag = req.query.tag;
//     const maxBudget = req.query.maxBudget;
//     const minBudget = req.query.minBudget;
//     const minDate = req.query.minDate;
//     const maxDate = req.query.maxDate;
//     const language = req.query.language;


//     const sortBy = req.query.sortBy;
//     const order = req.query.order;

//     let query = {}; // Create an object to build your query
//     let sortOptions = {};

//     try {
//         // Build query based on input parameters
//         if (name) {
//             query.name = { $regex: name, $options: 'i' }; // Filter by name if provided
//         }

//         if (tag) {
//             const tagID = await itineraryTags.findOne({ tag }).select('_id');
//             if (tagID) {
//                 // Use $elemMatch properly to filter tags 
//                 query.tags = { $elemMatch: { $eq: tagID._id } }; // Check if tagID._id is included in the tags array
//             }
//         }

//         if (minBudget || maxBudget) {
//             query.price = {};
//             if (minBudget) {
//                 query.price.$gte = minBudget;
//             }
//             if (maxBudget) {
//                 query.price.$lte = maxBudget;
//             }
//         }

//         if (minDate || maxDate) {
//             query.available_dates = { $elemMatch: {} };
//             if (minDate) {
//                 query.available_dates.$elemMatch.$gte = new Date(minDate); // Convert to Date object
//             }
//             if (maxDate) {
//                 query.available_dates.$elemMatch.$lte = new Date(maxDate); // Convert to Date object
//             }
//         }

//         if (language) {
//             query.language = language; // Filter by language if provided
//         }
//         console.log(sortBy);
//         // Set sorting options if provided
//         if (sortBy && order) {
//             sortOptions[sortBy] = order === 'asc' ? 1 : -1;
//         }

//         console.log('Query:', query);
//         console.log('Sort Options:', sortOptions);

//         // Fetch the itinerary using the built query
//         let itinerary = await Itinerary.find(query).sort(sortOptions).populate('tags');

//         if (itinerary.length === 0) {
//             return res.status(404).json({ message: "Itinerary doesn't exist" });
//         }

//         return res.status(200).json(itinerary);
//     } catch (error) {
//         res.status(500).json({ message: error.message }); // Handle server errors
//     }
// };

export const getItinerary = async (req, res) => {

    const id = req.query.id;
    const name = req.query.name;
    const tag = req.query.tag;
    const maxBudget = req.query.maxBudget;
    const minBudget = req.query.minBudget;
    const minDate = req.query.minDate;
    const maxDate = req.query.maxDate;
    const language = req.query.language;

    const sortBy = req.query.sortBy;
    const order = req.query.order;


    let query = {};
    let sortOptions = {};

    // Only fetch active itineraries
    query.isActive = true;
    let conversionRate;

    try {
        console.log(query);
        if (req.query.currency) {
            conversionRate = await getConversionRate(req.query.currency);
        }

        // Build query based on input parameters
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Filter by name if provided
        }

        if (tag) {
            const tagID = await itineraryTags.findOne({ tag }).select('_id');
            if (tagID) {
                query.tags = { $elemMatch: { $eq: tagID._id } };
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
        if (sortBy && order && order !== 'undefined' && order !== 'undefined') {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        // Fetch itineraries with filters and sort options
        let itineraries = await Itinerary.find(query).sort(sortOptions).populate('tags');

        if (itineraries.length === 0) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        itineraries = itineraries.filter(itinerary => itinerary.isActive === true && itinerary.flagged === false);

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





//@desc get all itineraries
//@route GET api/itinerary
export const getMyItineraries = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const conversionRate = await getConversionRate(req.query.currency);

        const itinerary = await Itinerary.find({
            tourGuideID: id,
            $or: [{ flagged: false }, { flagged: { $exists: false } }]
        });

        if (!itinerary) {
            return res.status(404).json({ message: "No active itineraries found" });
        }

        if (conversionRate) {
            itinerary = itinerary.map(itinerary => {
                itinerary.price = itinerary.price * conversionRate;
                return itinerary;
            });
        }

        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export const getMyItineraries = async (req, res) => {
//     const id = req.params.id;
//     console.log(id);

//     try {
//         const itineraries = await Itinerary.find({ 
//             tourGuideID: id, 
//             flagged: false 
//         });
//         res.status(200).json(itineraries);
//     }
//     catch (error) {
//         res.status(401).json({ message: error.message });
//     }
// }



// export const viewAllItineraries = async (req, res) => {
//     try {
//         const itineraries = await Itinerary.find(); 

//         if (itineraries.length === 0) {
//             return res.status(404).json({ message: "No active itineraries found" });
//         }

//         res.status(200).json(itineraries);
//     } catch (error) {
//         res.status(401).json({ message: "Error fetching itineraries." });
//     }
// };


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

// export const updateItinerary = async (req, res) => {
//     const itineraryID = req.params.id;
//     const name = req.body.title;
//     console.log("This is the request body:" + req.body);

//     const { days, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility } = req.body;
//     const updatedFields = {};

//     try {
//         let itinerary = await Itinerary.findById(itineraryID);

//         if (!itinerary) {
//             return res.status(404).json({ message: "No itineraries found " + itinerary });
//         }

//         if (itinerary.bookings != 0) {
//             res.status(404).json({ message: "Cannot update itinerary with bookings" })
//         }

//         const updatedFields = {};
//         if (name) updatedFields.name = req.body.title;
//         if (days) updatedFields.days = req.body.days;
//         if (language) updatedFields.language = req.body.language;
//         if (price) updatedFields.price = req.body.price;
//         if (available_dates) updatedFields.available_dates = req.body.available_dates;
//         if (pickUpLocation) updatedFields.pickUpLocation = req.body.pickUpLocation;
//         if (dropOffLocation) updatedFields.dropOffLocation = req.body.dropOffLocation;
//         if (accessibility) updatedFields.accessibility = req.body.accessibility;


//         // if (activities) {
//         //     updatedFields.$push = { activities: newActivity };
//         // }

//         console.log("updated Fields: " + updatedFields);

//         // Update the itinerary using the updatedFields object
//         const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: updatedFields }, { new: true, runValidators: true });

//         // Send the updated itinerary back in the response
//         res.status(200).json(updatedItinerary);

//     } catch (error) {
//         res.status(401).json({ message: "itinerary deosn't exist:" + error.message });
//         console.log(error);
//     }


// }

export const getItineraryById = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    if (!id) {
        return res.status(400).json({ message: "Itinerary ID is required." });
    }
    try {

        const itinerary = await Itinerary.findById(id).populate("tags");
        const conversionRate = await getConversionRate(req.query.currency);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found ." });
        }
        if (itinerary.flagged === true) {
            return res.status(404).json({ message: "Itinerary is flagged." });
        }

        if (conversionRate) {
            itinerary.price = itinerary.price * conversionRate;
        }

        return res.status(200).json(itinerary);

    } catch (error) {
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


// export const ItineraryActivation = async (req, res) => {
//     const itineraryID = req.params.id;

//     try {
//         const itinerary = await Itinerary.findById(itineraryID);

//         if (itinerary.bookings > 0) {
//             if (!itinerary.isActive) {
//                 return res.status(400).json({ message: "Itinerary is already deactivated." });
//             }

//             itinerary.isActive = false;

//         } else {

//             itinerary.isActive = !itinerary.isActive; 
//         }

//         const updatedItinerary = await itinerary.save();
//         return res.status(200).json({ message: "Itinerary status updated.", itinerary: updatedItinerary });
//     } catch (error) {
//         return res.status(500).json({ message: "Error updating itinerary status", error: error.message });
//     }
// };



export const updateItinerary = async (req, res) => {
    const itineraryID = req.params.id;
    const name = req.body.title;
    console.log("This is the request body:" + req.body);

    const { days, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility, isActive } = req.body;
    const updatedFields = {};

    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itineraries found " + itinerary });
        }

        const numsOfBookings = await Booking.find({ itineraryID: req.params.id }).count();

        if (numsOfBookings != 0) {
            res.status(404).json({ message: "Cannot update itinerary with bookings" })
        }

        const updatedFields = {};
        if (name) updatedFields.name = req.body.title;
        if (days) updatedFields.days = req.body.days;
        if (language) updatedFields.language = req.body.language;
        if (price) updatedFields.price = req.body.price;
        if (available_dates) updatedFields.available_dates = req.body.available_dates;
        if (pickUpLocation) updatedFields.pickUpLocation = req.body.pickUpLocation;
        if (dropOffLocation) updatedFields.dropOffLocation = req.body.dropOffLocation;
        if (accessibility) updatedFields.accessibility = req.body.accessibility;


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
        res.status(200).json(updatedItinerary);

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
    const flagger = req.body.flagger;

    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itinerary found with ID " + itineraryID });
        }


        if (flagger === false && itinerary.flagged === true) {
            return res.status(400).json({ message: "Cannot unflag an already flagged itinerary" });
        } else {
            itinerary.flagged = flagger;
            await itinerary.save();
        }


        res.status(200).json(itinerary);

    } catch (error) {
        res.status(500).json({ message: "Error updating itinerary: " + error.message });
        console.log(error);
    }
};
