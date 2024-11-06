import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import { addLoyaltyPoints, refundMoney } from "../utils/Helpers.js";
import Booking from "../models/bookingsSchema.js";
import e from "express";


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
                amountByWallet: walletAmount
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
        const newWallet = tourist.wallet + event.price;
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


