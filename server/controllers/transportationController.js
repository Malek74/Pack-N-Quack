import Transportation from "../models/transportationSchema.js";
import { getConversionRate } from "../utils/Helpers.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import product from "../models/productSchema.js";
import PromoCodes from "../models/promoCodesSchema.js";

//@desc Get all transportation
//@route GET /api/transportation
export const getTransportation = async (req, res) => {
    const currency = req.query.currency || "USD";
    const advertiserID = req.query.advertiserID;
    let transportation = [];

    try {
        const conversionRate = await getConversionRate(currency);
        if (advertiserID && advertiserID != "" && advertiserID != "undefined") {
            transportation = await Transportation.find({ advertiserID: advertiserID }).populate('advertiserID');
        }
        else {
            transportation = await Transportation.find().populate('advertiserID');
        }
        transportation.forEach((transport) => { transport.price = transport.price * conversionRate });
        return res.status(200).json(transportation);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: error.message });
    }
}

//@desc Get transportation by id
//@route GET /api/transportation/:id
export const getTransportationById = async (req, res) => {
    const currency = req.query.currency || "USD" || "USD";
    const id = req.params.id;

    console.log(id);

    try {
        const conversionRate = await getConversionRate(currency);
        const transportation = await Transportation.findById(id);
        transportation.price = transportation.price * conversionRate;
        return res.status(200).json(transportation);
    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: error.message });
    }
}


//@desc create transportation
//@route POST /api/transportation
export const createTransportation = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { name, price, type, available, origin, destination, date } = req.body;

    if (!name || !price || !type || !available || !origin || !destination || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {


        const stripeProduct = await stripeInstance.products.create({
            name: name,
            description: `Trip from ${origin} to ${destination}`,
            default_price_data: {
                currency: "usd",
                unit_amount: price * 100,
            },
        });
        const newTransportation = await Transportation.create({
            name,
            price,
            advertiserID: id,
            type,
            available,
            origin,
            destination,
            date,
            stripeID: stripeProduct.id
        });
        return res.status(201).json(newTransportation);
    } catch (error) {
        return res.status(409).json({ message: error.message });
    }
}

//@desc book transportation
//@route POST /api/transportation/book/:id
export const bookTransportation = async (req, res) => {

    const touristID = req.params.id;
    const { eventID, numOfTickets, promocode } = req.body;
    console.log(req.body);
    let event = {}
    try {

        //fetch data of transportation
        event = await Transportation.findById(eventID);
        if (!event) {
            return res.status(404).json({ error: 'Transportation not found' });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const product = await stripe.products.retrieve(event.stripeID);
        const tourist = await Tourist.findById(touristID);
        if (!tourist) {
            return res.status(404).json({ error: 'Tourist not found' });
        }

        const price = await stripe.prices.create({
            currency: 'usd',
            product: product.id,
            unit_amount: event.price * 100,
        });

        //fetch promocode if it exists
        let promo;
        if (promoCode) {
            promo = await PromoCodes.findOne({ code: promoCode });

            if (!promo) {
                res.status(400).send("Promocode does not exist");
            }

            if (!promo.isActive) {
                res.status(400).send("Promocode has already been used");
            }

            //set promocode to inactive 


            //check if it's his birthday promo
            if (promo.code == tourist.promoCode.code) {
                //today is birthday
                const today = new Date();
                const birthDate = new Date(tourist.dob);
                const lastUsed = new Date(tourist.promoCode.lastUsed);

                if (lastUsed.getDate() === birthDate.getDate() && lastUsed.getMonth() === birthDate.getMonth() && lastUsed.getFullYear() === birthDate.getFullYear()) {
                    res.status(400).json({ message: "Promocode has already been used" });
                }

                if (!(today.getDate() === birthDate.getDate() && today.getMonth() === birthDate.getMonth())) {
                    res.status(400).json({ message: "Promocode can be used only on your birthday" });
                }
            }
            else {
                await PromoCodes.findByIdAndUpdate(promo._id, { isActive: false });

            }
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: price.id,
                quantity: numOfTickets,
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/touristDashboard/booked', //todo:add correct link
            cancel_url: 'https://www.amazon.com/',  //todo:add correct link
            discounts: promo ? [{ promotion_code: promo.stripeID }] : [],
            metadata: {
                eventID: eventID,
                touristID: touristID,
                type: "transportation",
                price: numOfTickets * event.price,
                date: event.date,
                numOfTickets: numOfTickets
            }
        });
        return res.status(200).json({ url: session.url });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }

}


