
import mongoose from 'mongoose';
import Places from '../models/PlacesSchema.js';
import Tag from '../models/tagSchema.js';
import { getConversionRate } from '../utils/Helpers.js';
import { query } from 'express';

const formatTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    return `${formattedHours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
};
const convertOpeningHours = (openingHourObj) => {
    const daysOfWeek = Object.keys(openingHourObj); // Get the days of the week

    return daysOfWeek.map((day, index) => {
        const { open, openingTime, closingTime } = openingHourObj[day];

        return {
            day,
            openTime: openingTime ? formatTime(openingTime) : '',
            closeTime: closingTime ? formatTime(closingTime) : '',
            isOpen: open,
            _id: new mongoose.Types.ObjectId() // Generate a new ObjectId for each day
        };
    });
};

// Create Place function
export const createPlace = async (req, res) => {

    try {
        if (!req.body.tickets) {
            return res.status(400).json({ message: "Please add a price" });
        }
        // // Check for location and name duplicates 
        // const existingPlace = await Places.findOne({
        //     googleMapLink: googleMapLink
        // });

        // if (existingPlace) {
        //     return res.status(400).json({ message: "A place with this location already exists." });
        // }
        if (req.body.tags) {
            let tagsIDs = [];
            for (let i = 0; i < req.body.tags.length; i++) {
                const tag = await Tag.findOne({ name_tag: req.body.tags[i].name_tag, option: req.body.tags[i].option });
                tagsIDs.push(tag._id);
            }

            req.body.tags = tagsIDs;
        }
        if (req.body.opening_hour) {
            req.body.opening_hour = convertOpeningHours(req.body.opening_hour);
        }
        console.log(req.body)
        const newPlace = await Places.create(
            req.body
        );
        return res.status(201).json(newPlace);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Read Place function
export const readPlace = async (req, res) => {
    const { name } = req.params;
    const prefCurrency = req.query.currency || "USD";


    if (!prefCurrency) {
        return res.status(400).json({ message: "Please provide a currency" });
    }

    try {
        // Search for the place by its name
        const place = await Places.findOne({ name }).populate('tags');
        const conversionRate = await getConversionRate(prefCurrency); //getConversionRate(prefCurrency);

        //iterate through the tickets and convert the price to the preferred currency

        for (let i = 0; i < place.tickets.length; i++) {
            console.log(conversionRate);
            place.tickets[i].price = place.tickets[i].price * conversionRate;
        }

        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        res.status(200).json(place);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePlace = async (req, res) => {
    const placeID = req.body.id;

    try {
        // Find the place by its name
        const place = await Places.findOne({ _id: placeID });
        //console.log(place);

        // If place is not found, return an error
        if (!place) {
            return res.status(404).json({ message: "Place not found" });
        }

        // Check if tags are being updated
        if (req.body.tags) {
            let tagsIDs = [];
            for (let i = 0; i < req.body.tags.length; i++) {
                const tag = await Tag.findOne({ name_tag: req.body.tags[i].name_tag, option: req.body.tags[i].option });
                tagsIDs.push(tag._id);
            }

            req.body.tags = tagsIDs;
        }

        // Check if opening hours are being updated
        if (req.body.opening_hour) {
            req.body.opening_hour = convertOpeningHours(req.body.opening_hour);
        }
        // Update the place with the new data and populate tags
        const updatedPlace = await Places.findOneAndUpdate(
            { _id: placeID }, // Match the place by name
            req.body, // Apply the updates
            { new: true } // Return the updated document
        ).populate('tags'); // Populate the tags in the response
        console.log(req.body);
        console.log(updatedPlace);

        // Respond with the updated place
        return res.status(200).json(updatedPlace);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// Get all places
export const getAllPlaces = async (req, res) => {
    console.log("get all places");
    try {
        // Find all places in the database
        const places = await Places.find().populate('tags'); // Populate tags if you want tag details as well

        const conversionRate = await getConversionRate(req.query.currency || "USD");

        // Iterate through the places and convert the prices to the preferred currency
        for (let i = 0; i < places.length; i++) {
            for (let j = 0; j < places[i].tickets.length; j++) {
                places[i].tickets[j].price = places[i].tickets[j].price * conversionRate;
            }
        }
        // Send back the list of places
        return res.status(200).json(places);
    } catch (error) {
        // Handle any errors that occur during the request
        return res.status(500).json({ message: error.message });
    }
};

// Delete Place function
export const deletePlace = async (req, res) => {
    const { name } = req.params;  // Ensure name is passed in the request body
    console.log(name);
    try {
        // Find the place by name and delete it
        const deletedPlace = await Places.findOneAndDelete({ _id: name });  // Use correct query object

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }

        return res.status(200).json(deletePlace);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Search for a specific place using name and/or tag
export const SearchForPlace = async (req, res) => {
    const { name, tags } = req.body;
    console.log(req.body)
    try {
        let query = {};
        const conversionRate = await getConversionRate(req.query.currency || "USD");

        // If name is provided, add it to the match criteria
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (tags) {
            let tagsIDs = [];
            let flag = false;
            for (let i = 0; i < tags.length; i++) {
                const tag = await Tag.findOne({ name_tag: tags[i].name_tag, option: tags[i].option });
                tagsIDs.push(tag._id);
                flag = true;
            }
            console.log(tagsIDs)
            if (flag)
                query.tags = { $in: tagsIDs }; // This checks if any of the tagIDs in 'tags' array is in the 'tags' field of activity
        }
        // Search for places based on the constructed match criteria
        console.log(query)
        const searchedPlaces = await Places.find(query).populate('tags');
        //console.log(searchedPlaces)
        if (searchedPlaces.length === 0) {
            return res.status(404).json({ message: "No places found matching the criteria" });
        }

        // Iterate through the places and convert the prices to the preferred currency
        for (let i = 0; i < searchedPlaces.length; i++) {
            for (let j = 0; j < searchedPlaces[i].tickets.length; j++) {
                searchedPlaces[i].tickets[j].price = searchedPlaces[i].tickets[j].price * conversionRate;
            }
        }

        return res.status(200).json(searchedPlaces);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Filter places by tag
export const FilterPlacesByTag = async (req, res) => {
    const { tag } = req.query; // Assume the tag is passed as a query parameter in the format: tag=name_tag,options
    console.log(tag);

    try {
        // Validate the tag input
        if (!tag || typeof tag !== 'string') {
            return res.status(400).json({ message: "Invalid tag format. Provide a tag in the format: name_tag,options." });
        }

        const conversionRate = await getConversionRate(req.query.currency || "USD");

        // Split the tag into name_tag and options
        const [name_tag, options] = tag.split(',').map(item => item.trim());

        // Find matching tags in the database
        const matchingTags = await Tag.find({
            name_tag: name_tag,
            options: options // Ensure we match the specified options
        }).distinct('_id');

        // If no matching tags found, return a 404 response
        if (matchingTags.length === 0) {
            return res.status(404).json({ message: "No matching tags found." });
        }

        // Fetch places that have the matching tags
        const filteredPlaces = await Places.find({ tags: { $in: matchingTags } }).populate('tags');

        if (filteredPlaces.length === 0) {
            return res.status(404).json({ message: "No places found with the specified tag." });
        }

        // Iterate through the places and convert the prices to the preferred currency
        for (let i = 0; i < filteredPlaces.length; i++) {
            for (let j = 0; j < filteredPlaces[i].tickets.length; j++) {
                filteredPlaces[i].tickets[j].price = filteredPlaces[i].tickets[j].price * conversionRate;
            }
        }

        res.status(200).json(filteredPlaces);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getMyPlaces = async (req, res) => {
    const tgID = req.params.name
    console.log(tgID)
    try {
        const conversionRate = await getConversionRate(req.query.currency || "USD");

        const places = await Places.find({ touristGovenorID: tgID }).populate('tags');
        console.log(places)

        //
        for (let i = 0; i < places.length; i++) {
            for (let j = 0; j < places[i].tickets.length; j++) {
                //check if price is not null
                if (places[i].tickets[j].price !== null) {
                    places[i].tickets[j].price = places[i].tickets[j].price * conversionRate;

                }
            }
        }
        return res.status(200).json(places);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}