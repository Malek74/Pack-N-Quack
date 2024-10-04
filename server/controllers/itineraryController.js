import Itinerary from '../models/itinerarySchema.js';
import itineraryTags from '../models/itineraryTagsSchema.js';

//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {


    //fetch data from request body
    const { ratings, name, tourGuideID, activities, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility, tags } = req.body;

    //validate that all fields are present
    if (!ratings || !tourGuideID || !name || !activities || !language || !price || !available_dates || !tags || !pickUpLocation || !dropOffLocation || !accessibility) {

        //write missing fields
        if (!ratings) {
            return res.status(400).json({ "message": "Rating is missing" });
        }
        if (!name) {
            return res.status(400).json({ "message": "Name is missing" });
        }
        if (!tourGuideID) {
            return res.status(400).json({ "message": "TourGuideID is missing" });
        }
        if (!activities) {
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



    }

    const tagsToInsert = [];
    for (let i = 0; i < tags.length; i++) {

        //search for tag in the database
        const tagExists = await itineraryTags.findOne({ tag: tags[i] });
        if (tagExists) {
            tagsToInsert.push(tagExists._id)
        }
        else {
            const newTag = new itineraryTags({
                tag: tags[i]
            });

            const createdTag = await itineraryTags.create(newTag);
            tagsToInsert.push(createdTag._id)
        }
    }

    try {
        const itinerary = new Itinerary({
            ratings: ratings,
            name: name,
            tourGuideID: tourGuideID,
            activities: activities,
            language: language,
            price: price,
            available_dates: available_dates,
            pickUpLocation: pickUpLocation,
            dropOffLocation: dropOffLocation,
            accessibility: accessibility,
            tags: tagsToInsert
        });

        const createdItinerary = await Itinerary.create(itinerary);
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }

};

//@desc get a single itinerary by id, category, or tag
//@route GET api/itinerary
export const getItinerary = async (req, res) => {
    const name = req.query.name;
    const tag = req.query.tag;
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
            query.name = name; // Filter by name if provided
        }

        if (tag) {
            const tagID = await itineraryTags.findOne({ tag }).select('_id');
            if (tagID) {
                // Use $elemMatch properly to filter tags
                query.tags = { $elemMatch: { $eq: tagID._id } }; // Check if tagID._id is included in the tags array
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
        let itinerary = await Itinerary.find(query).populate('tags').sort(sortOptions);

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

        console.log(itineraryToDelete.bookings);
        if (itineraryToDelete.bookings != 0) {
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

    const { name, activities, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility } = req.body;
    const updatedFields = {};



    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itineraries found " + itinerary });
        }

        if (itinerary.bookings != 0) {
            res.status(404).json({ message: "Cannot update itinerary with bookings" })
        }

        const updatedFields = {};
        if (name) updatedFields.name = req.body.name;
        if (activities) updatedFields.activities = req.body.activities;
        if (language) updatedFields.language = req.body.language;
        if (price) updatedFields.price = req.body.price;
        if (available_dates) updatedFields.available_dates = req.body.available_dates;
        if (pickUpLocation) updatedFields.pickUpLocation = req.body.pickUpLocation;
        if (dropOffLocation) updatedFields.dropOffLocation = req.body.dropOffLocation;
        if (accessibility) updatedFields.accessibility = req.body.accessibility;

        // Update the itinerary using the updatedFields object
        const updatedItinerary = await Itinerary.findByIdAndUpdate(itineraryID, { $set: updatedFields }, { new: true });

        // Send the updated itinerary back in the response
        res.status(200).json(updatedItinerary);

    } catch (error) {
        res.status(401).json({ message: "itinerary deosn't exist:" + error.message });
    }


}