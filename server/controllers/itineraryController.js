import Itinerary from '../models/itinerarySchema.js';
import itineraryTags from '../models/itineraryTagsSchema.js';
import ItineraryTag from '../models/itineraryTagsSchema.js';

//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {

    //fetch data from request body
    const { name, tourGuideID, activities, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility, tags } = req.body;

    //validate that all fields are present
    if (!tourGuideID || !name || !activities || !language || !price || !available_dates || !tags || !pickUpLocation || !dropOffLocation, !accessibility) {
        return res.status(400).json({ "message": "Error data isn't complete" });

    }

    const tagsToInsert = [];
    for (let i = 0; i < tags.length; i++) {
        const tag = await ItineraryTag.findOne({ tag: tags[i] });
        tagsToInsert.push(tag._id)
    }

    try {
        const itinerary = new Itinerary({
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

    //get query inputs    
    const name = req.query.name;
    const tag = req.query.tag;
    const maxBudget = req.query.maxBudget;
    const minBudget = req.query.minBudget;
    const date = req.query.date;
    const language = req.query.language;

    const sortBy = req.query.sortBy;
    const order = req.query.order;


    let sortOptions = {};
    try {
        let query = {}; // Create an object to build your query

        if (name) {
            query.name = name; // Filter by ID if provided
        }
        if (tag) {
            query.accessibility = tag; // Assuming 'tag' maps to the accessibility field
        }

        if (maxBudget && minBudget) {
            query.price = { $gte: minBudget, $lte: maxBudget }; // Filter by price range if provided
        }



        if (date) {
            query.available_dates = { $gte: date }; // Filter by date if provided
        }

        if (language) {
            query.language = language; // Filter by language if provided
        }

        console.log(query);
        // Set sorting options if provided
        if (sortBy && order) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        console.log(sortOptions);

        // Fetch the itinerary using the built query
        const itinerary = await Itinerary.find(query).sort(sortOptions);

        if (itinerary.length == 0) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        // itinerary.sort(sortOptions);

        return res.status(200).json(itinerary);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

//@desc get upcoming itineraries
//@route GET api/itineraries/upcoming
export const upcomingIternaries = async (req, res) => {
    res.send("Upcoming itineraries");
}

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