import Transportation from "../models/transportationSchema.js";
import { getConversionRate } from "../utils/Helpers.js";
import Stripe from "stripe";
import Tourist from "../models/touristSchema.js";
import PromoCodes from "../models/promoCodesSchema.js";
import transactionModel from "../models/transactionsSchema.js";
import { sendPaymentReceipt } from "../controllers/webhook.js"

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
    const id = req.user._id;
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

    const touristID = req.user._id;
    const { eventID, numOfTickets, promoCode, payByWallet, date } = req.body;
    const success_url = 'http://localhost:5173/touristDashboard/booked';
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


        //fetch promocode if it exists
        let amountToPay = event.price * numOfTickets;
        let promo;
        if (promoCode) {
            promo = await PromoCodes.findOne({ code: promoCode });
            console.log(promo);

            if (!promo) {
                res.status(400).send("Promocode does not exist");
            }

            if (!promo.isActive) {
                res.status(400).send("Promocode has already been used");
            }
            if (!(promo.isBirthday)) {
                amountToPay -= amountToPay * (promo.discount / 100);
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
                amountToPay -= amountToPay * (promo.discount / 100);



            }
        }

        let walletAmount
        //handle payment by wallet and related transactions
        if (payByWallet) {
            let amountLeftToPay
            if (amountToPay > tourist.wallet) {
                amountLeftToPay = amountToPay - tourist.wallet;
                walletAmount = tourist.wallet;
            }
            else {
                amountLeftToPay = 0;
                walletAmount = amountToPay;
            }

            let transaction;
            console.log("wallet amount: ", walletAmount);
            //create transaction for amount paid from wallet
            if (walletAmount > 0) {

                //create transaction for wallet deduction
                transaction = await transactionModel.create({
                    userId: touristID,
                    title: event.name,
                    amount: walletAmount,
                    date: new Date(),
                    method: "wallet",
                    incoming: false,
                    description: `Wallet deduction for booking  ${event.name}`
                });
                console.log(transaction);
            }

            console.log("amount left to pay: ", amountLeftToPay);
            //create a booking


            //update wallet amount
            await Tourist.findByIdAndUpdate(touristID, { wallet: tourist.wallet - walletAmount });
            console.log("amount left to pay: ", amountLeftToPay);

            if (amountLeftToPay == 0) {
                sendPaymentReceipt(tourist.email, tourist.username, `${event.name}`, event.date, amountToPay, tourist._id);
                return res.status(200).json({ message: "Payment successful", url: success_url });
            }
            else {
                sendPaymentReceipt(tourist.email, tourist.username, `${event.name}`, event.date, amountToPay, tourist._id);

                //create price to be paid after deducting wallet amount        
                const price = await stripe.prices.create({
                    currency: 'usd',
                    product: product.id,
                    unit_amount: amountLeftToPay * 100,
                });

                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    line_items: [{
                        price: price.id,
                        quantity: 1,
                    }],
                    mode: 'payment',
                    success_url: 'http://localhost:5173/touristDashboard/booked', //todo:add correct link
                    cancel_url: 'https://www.amazon.com/',  //todo:add correct link

                });
            }
        }
        else {
            //create transaction for amount left to pay by card
            await transactionModel.create({
                userId: touristID,
                title: event.name,
                amount: amountToPay,
                date: new Date(),
                method: "card",
                incoming: false,
                description: `Payment for booking for ${event.name}`
            });

            //create price to be paid after deducting wallet amount        
            const price = await stripe.prices.create({
                currency: 'usd',
                product: product.id,
                unit_amount: amountToPay * 100,
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price: price.id,
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: 'http://localhost:5173/touristDashboard/booked', //todo:add correct link
                cancel_url: 'https://www.amazon.com/',  //todo:add correct link

            });
            sendPaymentReceipt(tourist.email, tourist.username, `${event.name}`, event.date, amountToPay, tourist._id);
            return res.status(200).json({ url: session.url });
        }
    }

    catch (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }

}


