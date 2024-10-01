import Itinerary from '../models/itinerarySchema.js';

//@desc create a new itinerary
//@route POST api/itinerary
//@Body {activities,language,price}
export const addItinerary = async (req, res) => {

    //fetch data from request body
    const { tourGuideID, activities, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility } = req.body;

    //validate that all fields are present
    if (!tourGuideID || !activities || !language || !price || !available_dates || !pickUpLocation || !dropOffLocation, !accessibility) {
        return res.status(400).json({ "tourID": tourGuideID });

    }


    try {
        const itinerary = new Itinerary({
            tourGuideID: tourGuideID,
            activities: activities,
            language: language,
            price: price,
            available_dates: available_dates,
            pickUpLocation: pickUpLocation,
            dropOffLocation: dropOffLocation,
            accessibility: accessibility
        })

        const createdItinerary = await Itinerary.create(itinerary);
        res.status(201).json(itinerary);
    } catch (error) {
        res.status(500).json({ message: "Error creating itinerary", error: error.message });
    }

};

export const getItinerary = async (req, res) => {
    const itineraryID = req.params.id;

    try {
        const itinerary = await Itinerary.findById(itineraryID);
        res.status(200).json(itinerary);
    } catch (error) {
        res.status(401).json({ message: "itinerary deosn't exist" });
    }

};

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

    const { activities, language, price, available_dates, pickUpLocation, dropOffLocation, accessibility } = req.body;
    const updatedFields = {};



    try {
        let itinerary = await Itinerary.findById(itineraryID);

        if (!itinerary) {
            return res.status(404).json({ message: "No itineraries found " +itinerary });
        }

        if (itinerary.bookings != 0) {
            res.status(404).json({ message: "Cannot update itinerary with bookings" })
        }

        const updatedFields = {};
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