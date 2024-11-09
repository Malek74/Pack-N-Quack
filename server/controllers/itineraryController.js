import Itinerary from '../models/itinerarySchema.js';
import itineraryTags from '../models/itineraryTagsSchema.js';
import product from '../models/productSchema.js';
import tourist from '../models/touristSchema.js';
import { addLoyaltyPoints } from '../utils/Helpers.js';
import Stripe from 'stripe';
import Booking from "../models/bookingsSchema.js";
import { uploadImages } from '../utils/Helpers.js';
import activityTag from '../models/activityTagSchema.js';



//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {
    // console.log(req.files)
    // console.log("end of files")
    // console.log(req.files['coverImage'])
    // console.log("end of cover Images")
    // console.log(req.body);
    // console.log("end of body")
    //fetch data from request body
    const tourGuideID = req.body.tourGuideID;
    const name = req.body.name;
    const { language, price, accessibility, tags, description, images, coverImage, activityImages, available_dates } = req.body;
    const days = JSON.parse(req.body.days);
    const pickUpLocation = JSON.parse(req.body.pickUpLocation);
    const dropOffLocation = JSON.parse(req.body.dropOffLocation);
    console.log(days)
    console.log(days[0].activities[0].image); // "Coffee Date"
    console.log(days[0].activities[0].duration.startTime); // "10:00"
    console.log(pickUpLocation)
    console.log(dropOffLocation)
    let tagsIDS = []
    //validate that all fields are present
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
    const tagstoLoop = tags
    for (let i = 0; i < tags.length; i++) {
        const tag = await itineraryTags.findOne({ tag: tags[i] });
        console.log(tag)
    }
    console.log(tagsIDS)
    console.log("end of days")


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

        if (coverImage) {
            const uploadResult = await uploadImages(coverImage);
            if (uploadResult.success) {
                coverImage = uploadResult.urls[0];
            }
            return res.status(400).json({ message: uploadResult.message });
        }

        if (images) {
            const uploadResult = await uploadImages(images);
            if (uploadResult.success) {
                images = uploadResult.urls;
            }
            return res.status(400).json({ message: uploadResult.message });
        }

        if (activityImages) {
            const activityImagesUrls = (await uploadImages(activityImages)).urls
            let activityCount = 0;
            for (let day = 0; day < days.length && activityCount < activityImagesUrls.length; i++) {
                for (let activity = 0; activity < day.activities.length; activity++) {
                    days[day].activities[activity].image = activityCount
                    activityCount++;
                }
            }


            // let dayCount = 0;
            // for(let i = 0; i<activityImagesUrls.length; i++){
            //     days[dayCount].activity[i].image = activityImagesUrls[i]
            //     if( i+1 % days.length === 0 ){
            //         dayCount++
            //     }
            // }
        }




        // for(let i = 0; i < days.length; i++){
        //     for(let j = 0; j < days[i].activities.length; j++){
        //         const uploadResult = await uploadImages(days[i].activities[j].image);
        //         if(uploadResult.success){
        //             days[i].activities[j].image = uploadResult.urls[0];
        //         }
        //         return res.status(400).json( {message : uploadResult.message} );
        //     }
        // }
        // }

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
            images: images,
            coverImage: coverImage
        });
        const createdItinerary = await Itinerary.create(itinerary);

        return res.status(201).json(createdItinerary);
    }
    catch (error) {
        return res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }

};

//@desc get a single itinerary by id, category, or tag
//@route GET api/itinerary
export const getItinerary = async (req, res) => {



    const id = req.query.id;
    const name = req.query.name;
    const tags = req.query.tags;
    const maxBudget = req.query.maxBudget;
    const minBudget = req.query.minBudget;
    const minDate = req.query.minDate;
    const maxDate = req.query.maxDate;
    const language = req.query.language;


    const sortBy = req.query.sortBy;
    const order = req.query.order;

    let query = {}; // Create an object to build your query
    let sortOptions = {};

    try {
        // Build query based on input parameters
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Filter by name if provided
        }

        const tagsArray = tags.split(',');
        if (tagsArray && tagsArray.length > 0) {
            // Find all tag IDs based on the tag names provided
            const tagIDs = await itineraryTags.find({ tag: { $in: tagsArray } }).select('_id');

            if (tagIDs.length > 0) {
                // Use $in to filter itineraries with any of these tags
                query.tags = { $in: tagIDs.map(tag => tag._id) };
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
                query.available_dates.$elemMatch.$gte = new Date(minDate); // Convert to Date object
            }
            if (maxDate) {
                query.available_dates.$elemMatch.$lte = new Date(maxDate); // Convert to Date object
            }
        }

        if (language) {
            query.language = language; // Filter by language if provided
        }
        console.log(sortBy);
        // Set sorting options if provided
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        console.log('Query:', query);
        console.log('Sort Options:', sortOptions);

        // Fetch the itinerary using the built query
        let itinerary = await Itinerary.find(query).sort(sortOptions).populate('tags');


        if (itinerary.length === 0) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        return res.status(200).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle server errors
    }
};


//@desc get all itineraries
//@route GET api/itinerary
export const getMyItineraries = async (req, res) => {
    const id = req.params.id;
    console.log(id);

    try {
        const itinerary = await Itinerary.find({ tourGuideID: id });
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const viewAllItineraries = async (req, res) => {
    try {
        const itinerary = await Itinerary.find({});

        if (itinerary.length == 0) {
            return res.status(404).json({ message: "No itineraries found" });
        }

        res.status(200).json(itinerary);
    } catch (error) {
        res.status(401).json({ message: "itinerary deosn't exist" });
    }


};

export const deleteItinerary = async (req, res) => {

    try {
        var itineraryToDelete = await Itinerary.findById(req.params.id);

        if (!itineraryToDelete) {
            return res.status(404).json({ message: "No itineraries found" });
        }

        const numsOfBookings = await Booking.find({ itineraryID: req.params.id }).count();
        if (numsOfBookings != 0) {
            return res.status(404).json({ message: "Cannot delete itinerary with bookings" })
        }

        itineraryToDelete = await Itinerary.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "itinerary deleted" + itineraryToDelete });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const updateItinerary = async (req, res) => {
    const itineraryID = req.params.id;
    const name = req.body.title;
    console.log("This is the request body:" + req.body);

    const { days, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility } = req.body;
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


        // Update the itinerary using the updatedFields object
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: updatedFields }, { new: true, runValidators: true });

        // Send the updated itinerary back in the response
        res.status(200).json(updatedItinerary);

    } catch (error) {
        res.status(401).json({ message: "itinerary deosn't exist:" + error.message });
        console.log(error);
    }


}

export const getItineraryById = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    if (!id) {
        return res.status(400).json({ message: "Itinerary ID is required." });
    }

    try {
        const itineraryExists = await Itinerary.findById(id).populate("tags");

        if (!itineraryExists) {
            return res.status(404).json({ message: "Itinerary not found." });
        }
        return res.status(200).json(itineraryExists);

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getMaxPrice = async (req, res) => {
    try {
        const maxPrice = await Itinerary.aggregate([
            {
                $group: {
                    _id: null,
                    maxPrice: { $max: "$price" }
                }
            }
        ]);
        return res.status(200).json(maxPrice[0]?.maxPrice || 0);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const getAllLanguages = async (req, res) => {
    try {
        const languages = await Itinerary.distinct('language');
        return res.status(200).json(languages);
    } catch (error) {
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