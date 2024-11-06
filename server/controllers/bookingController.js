import activityModel from "../models/activitySchema.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import { addLoyaltyPoints, refundMoney } from "../utils/Helpers.js";
import Booking from "../models/bookingsSchema.js";
import Activity from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import advertiserModel from "../models/advertiserSchema.js";
import tourGuide from "../models/tourGuideSchema.js"

export const bookEvent = async (req, res) => {

    const touristID = req.params.id;
    const { eventType, eventID, payByWallet, numOfTickets } = req.body;

    let event = {}
    try {

        //fetch event
        if (eventType == "activity") {
            event = await activityModel.findById(eventID);
        }
        else if (eventType == "itinerary") {
            event = await Itinerary.findById(eventID);
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const product = await stripe.products.retrieve(event.stripeID);
        const tourist = await Tourist.findById(touristID);
        const walletAmount = (event.price * numOfTickets) - tourist.wallet;

        //create price to be paid after deducting wallet amount        
        const price = await stripe.prices.create({
            currency: 'usd',
            product: product.id,
            unit_amount: walletAmount * 100,
        });


        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: payByWallet ? price.id : product.default_price,
                quantity: numOfTickets,
            }],
            mode: 'payment',
            success_url: 'https://www.google.com/', //todo:add correct link
            cancel_url: 'https://www.amazon.com/',  //todo:add correct link
            metadata: {
                eventID: eventID,
                eventType: eventType,
                touristID: touristID,
                amountByWallet: walletAmount,
                type: "event"
            }
        });


        res.redirect(303, session.url);

    }
    catch (error) {
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
        if (eventType == "activity") {
            event = await activityModel.findById(eventID);
            booking = await Booking.findOne({ touristID: touristID, activityId: eventID, });

        }
        else if (eventType == "itinerary") {
            console.log(eventID);
            console.log(touristID);
            event = await Itinerary.findById(eventID);
            booking = await Booking.findOne({ itineraryID: eventID, touristID: touristID, });

        }

        //check current time is 48 hours before the event
        const currentTime = new Date();
        const eventDate = new Date(event.date);
        const diffTime = eventDate - currentTime;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays > 48) {
            return res.status(400).json({ error: 'An event cannot be canceled within 48 hours of its scheduled start time.' });
        }

        //fetch the session and related data from stripe
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const tourist = await Tourist.findById(touristID);
        const paymentSession = await stripe.checkout.sessions.retrieve(booking.stripeSessionID);


        //refund money
        const refundAmount = paymentSession.amount_total / 100;
        const newWallet = tourist.wallet + refundAmount;
        await Tourist.findByIdAndUpdate(touristID, { wallet: newWallet });

        //remove entry from bookings
        await Booking.findByIdAndDelete(booking._id);


        return res.status(200).json(tourist);



        res.redirect(303, session.url);

    }
    catch (error) {
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
        case 'Advertiser':
            userModel = advertiserModel;
            break;
        case 'Tourist':
            userModel = Tourist;
            break;
        case 'Tour Guide':
            userModel = tourGuide;
            break;
        default:
            return res.status(400).json({ message: "Invalid user type" });
    }

    try {
        const userExist = await userModel.findById(userId);
        if (!userExist) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        if (userModel === Tourist) {
            const hasBooking = await Booking.findOne({ touristID: userId });
            if (hasBooking && !hasBooking.status == 'cancelled') {
                return res.status(400).json({ message: "You cannot delete your account because you have booked an upcoming event" });
            }
        } else if (userModel === tourGuide) {
            const joinedItinerary = await Itinerary.findOne({ tourGuideID: userId });
            if (joinedItinerary && joinedItinerary.isActive == true && !joinedItinerary.flagged) {
                return res.status(400).json({ message: "You cannot delete your account because you are assigned to an upcoming event" });
            }
        } else {
            const joinedActivity = await Activity.findOne({ advertiserID: userId });
            if (joinedActivity && !joinedActivity.flagged) {
                return res.status(400).json({ message: "You cannot delete your account because you are assigned to an upcoming event" });
            }
        }
        await userModel.findByIdAndDelete(userId);
        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error) {
        console.error("Error processing account deletion:", error);
        return res.status(500).json({ message: error.message });
    }
};
