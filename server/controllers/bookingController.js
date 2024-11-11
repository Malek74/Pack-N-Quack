import activityModel from "../models/activitySchema.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import { addLoyaltyPoints, refundMoney, deleteProducts } from "../utils/Helpers.js";
import Booking from "../models/bookingSchema.js";
import Activity from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import DeleteRequest from '../models/deleteRequests.js';
import tourGuide from '../models/tourGuideSchema.js';
import seller from '../models/sellerSchema.js';
import product from "../models/productSchema.js";

export const bookEvent = async (req, res) => {

    const touristID = req.params.id;
    const { eventType, eventID, payByWallet, numOfTickets, dateSelected } = req.body;
    // console.log("Booking", req.body);
    let event = {}
    try {

        //fetch event
        if (eventType == "activity") {
            event = await activityModel.findById(eventID);
        }
        else if (eventType == "itinerary") {
            event = await Itinerary.findById(eventID);
        }
        let product = {};
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        if (eventType == "activity") {
            product = await stripe.products.retrieve(event.stripeProductID);
        }
        else {
            product = await stripe.products.retrieve(event.stripeID);
        }

        const tourist = await Tourist.findById(touristID);
        let amountToPay = 0;

        amountToPay = event.price;

        //create price to be paid after deducting wallet amount        
        const price = await stripe.prices.create({
            currency: 'usd',
            product: product.id,
            unit_amount: amountToPay * 100,
        });

        let success_url = "";

        if (eventType == "activity") {
            success_url = "http://localhost:5173/touristDashboard/activitiy-bookings";
        }
        else if (eventType == "itinerary") {
            success_url = "http://localhost:5173/touristDashboard/itinerary-bookings";
        }
        else {
            success_url = "http://localhost:5173/booked";
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: price.id,
                quantity: numOfTickets,
            }],
            mode: 'payment',
            success_url: success_url,
            cancel_url: 'https://www.amazon.com/',  //todo:add correct link
            metadata: {
                eventID: eventID,
                eventType: eventType,
                touristID: touristID,
                type: "event",
                price: event.price * numOfTickets,
                numOfTickets: numOfTickets,
                date: dateSelected 
            }
        });
        console.log("stripe date: ", new Date(session.metadata.date));
        console.log("date selected: ", req.body.dateSelected);
        // console.log("Session: ", session.url);
        return res.status(200).json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }

}

export const cancelBooking = async function (req, res) {

    const touristID = req.params.id;
    const { eventType, eventID } = req.body;

    if (!eventType || !eventID) {
        return res.status(400).json({ error: 'Please provide event type and event ID.' });
    }
    let event = {}
    let booking = {}
    try {
        //fetch event
        const booking = await Booking.findById(eventID);
        console.log(booking);

        if (eventType == "activity") {
            event = await activityModel.findById(booking.activityID);
            console.log(event);
        }
        else if (eventType == "itinerary") {
            console.log(eventID);
            console.log(touristID);
            event = await Itinerary.findById(booking.itineraryID);
        }

        //check current time is 48 hours before the event
        const currentTime = new Date();
        const eventDate = new Date(booking.date);
        const diffTime = eventDate - currentTime;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        console.log(diffDays);
        if (diffDays <= 2) {
            return res.status(400).json({ error: 'An event cannot be canceled within 48 hours of its scheduled start time.' });
        }

        //fetch the session and related data from stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const tourist = await Tourist.findById(touristID);
        const paymentSession = await stripe.checkout.sessions.retrieve(booking.stripeSessionID);


        //refund money
        const refundAmount = event.price;
        const newWallet = tourist.wallet + refundAmount;
        await Tourist.findByIdAndUpdate(touristID, { wallet: newWallet });

        //remove entry from bookings
        await Booking.findByIdAndDelete(booking._id);


        return res.status(200).json(tourist);

        res.redirect(303, session.url);

    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }

}




export const flaggedEvents = async (req, res) => {
    const { eventId, userId } = req.body;

    try {
        const userExist = await Tourist.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }
        let eventExist = await Itinerary.findById(eventId);
        if (!eventExist) {
            eventExist = await Activity.findById(eventId);
            if (!eventExist) {
                return res.status(404).json({ message: "Event doesn't exist" });
            }
        }

        const bookingExist = await Booking.findOne({ touristID: userId, $or: [{ itineraryID: eventId }, { activityID: eventId }] });

        if (!bookingExist) {
            return res.status(404).json({ message: "This tourist did not book this event" });
        }

        if (eventExist.flagged) {
            userExist.wallet += eventExist.price;
            await userExist.save();
        }

        return res.status(200).json({ message: "Sorry for the inconvenience, the money has been refunded" });

    } catch (error) {
        console.error("Error processing flagged events:", error);
        return res.status(500).json({ message: error.message });
    }
};



export const requestDeleteAccount = async (req, res) => {
    const { userId, userType } = req.body;

    let userModel;
    console.log(req.body);

    switch (userType) {
        case 'seller':

            if (!userId) {
                return res.status(400).json({ message: "Please provide a Seller ID" });
            }
            try {
                // const deletedSeller = await seller.findByIdAndDelete(userId);
                // await deleteProducts(userId);
                const sellerFound = await seller.findById(userId);
                const deleteRequest = await DeleteRequest.create({
                    name: sellerFound.username,
                    email: sellerFound.email,
                    userType: "Seller",
                    status: "approved",
                });

                //archive all products
                await product.updateMany({ seller_id: userId }, { isArchived: true });

                return res.status(200).json({ message: `Delete Request created successfully` });
            } catch (error) {
                return res.status(500).json({ message: error.message });
            }
            break;

        case 'tourist':
            const tourist = await Tourist.findById(userId);

            const deleteRequest = await DeleteRequest.create({ name: tourist.name, email: tourist.email, userType: "Tourist", date: new Date(), status: "approved" });
            return res.status(200).json({ message: `Delete Request created successfully` });

        case 'tourGuide':
            if (!userId) {
                return res.status(400).json({ message: "Tour Guide ID is required." });
            }
            try {
                //retrieve all itineraries of the tour guide that are active and not flagged and have dates in the future
                const tourGuideDelete = await tourGuide.findById(userId);

                const myItineraries = await Itinerary.find({ tourGuideID: userId, flagged: false, available_dates: { $elemMatch: { $gte: new Date() } } });

                //deactivate all my itineraries
                await Itinerary.updateMany({ tourGuideID: userId }, { isActive: false, flagged: true });

                //check if any of theses itineraries have bookings
                for (let i = 0; i < myItineraries.length; i++) {
                    const itirenaryBookings = await Booking.find({ itineraryID: myItineraries[i]._id, date: { $gte: new Date() } });
                    if (itirenaryBookings.length > 0) {
                        const deleteRequest = await DeleteRequest.create({ name: tourGuideDelete.username, email: tourGuideDelete.email, userType: "Tour Guide", date: new Date(), status: "rejected" });
                        return res.status(200).json({ message: "Delete Request created successfully." });
                    }
                }

                // const deletedTourGuide = await tourGuide.findByIdAndDelete(id);
                // if (!deletedTourGuide) {
                //     return res.status(404).json({ message: "Tour Guide not found." });
                // }

                const deleteRequest = await DeleteRequest.create({ name: tourGuideDelete.username, email: tourGuideDelete.email, userType: "Tour Guide", date: new Date(), status: "approved" });
                // deleteIteneraries(id);
                return res.status(200).json({ message: "Delete Request created successfully." });
            } catch (error) {
                return res.status(404).json({ message: error.message });
            }
        case 'advertisers':

            try {

                const upcomingActivities = await activityModel.find({ advertiserID: userId, date: { $gte: new Date() } });

                const advertiser = await advertiserModel.findById(userId);


                //flag all user activities
                await activityModel.updateMany({ advertiserID: userId }, { flagged: true });

                for (let i = 0; i < upcomingActivities.length; i++) {
                    const bookings = await Booking.find({ activityID: upcomingActivities[i]._id, date: { $gte: new Date() } });
                    if (bookings.length > 0) {
                        const request = await DeleteRequest.create({ name: advertiser.username, email: advertiser.email, userType: "Advertiser", date: new Date(), status: "rejected" });
                        return res.status(200).json({ message: `Delete Request created successfully` });
                    }
                }


                // const activitiesByAdvertiser = await activityModel.deleteMany({ advertiserID: userId });


                // console.log(activitiesByAdvertiser.deletedCount, 'activities deleted');
                // const deletedAdvertiser = await advertiserModel.findByIdAndDelete(userId);

                // res.status(200).json(deletedAdvertiser);
                const request = await DeleteRequest.create({ name: advertiser.username, email: advertiser.email, userType: "Advertiser", date: new Date(), status: "approved" });
                return res.status(200).json({ message: `Delete Request created successfully` });

            } catch (error) {
                res.status(404).json({ message: error.message });
            }
        default:
            return res.status(400).json({ message: "Invalid user type" });
    }

};
