import Amadeus from "amadeus";
import Stripe from 'stripe';
import { getConversionRate } from "../utils/Helpers.js";
import Tourist from "../models/touristSchema.js";
import PromoCodes from "../models/promoCodesSchema.js";

const cities = [
    { "city": "New York", "iata_code": "JFK" },
    { "city": "Los Angeles", "iata_code": "LAX" },
    { "city": "Chicago", "iata_code": "ORD" },
    { "city": "London", "iata_code": "LHR" },
    { "city": "Paris", "iata_code": "CDG" },
    { "city": "Tokyo", "iata_code": "HND" },
    { "city": "Cairo", "iata_code": "CAI" },
    { "city": "Beijing", "iata_code": "PEK" },
    { "city": "Dubai", "iata_code": "DXB" },
    { "city": "Sydney", "iata_code": "SYD" },
    { "city": "Berlin", "iata_code": "TXL" },
    { "city": "Toronto", "iata_code": "YYZ" },
    { "city": "Mexico City", "iata_code": "MEX" },
    { "city": "Moscow", "iata_code": "SVO" },
    { "city": "Seoul", "iata_code": "ICN" },
    { "city": "Sao Paulo", "iata_code": "GRU" },
    { "city": "Mumbai", "iata_code": "BOM" },
    { "city": "Hong Kong", "iata_code": "HKG" },
    { "city": "Bangkok", "iata_code": "BKK" },
    { "city": "Istanbul", "iata_code": "IST" }

]


export const listHotels = async (req, res) => {
    const cityName = req.body.cityName;

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    const cityCode = cities.find(city => city.city === cityName);
    try {
        const response = await amadeus.referenceData.locations.hotels.byCity.get({
            cityCode: cityCode.iata_code
        });
        const data = JSON.parse(response.body).data;
        return res.json(data);
    } catch (error) {
        return res.status(404).json({ message: error.message });
    }
}

export const listHotelRooms = async (req, res) => {
    const { hotelID, adults, checkInDate, checkOutDate } = req.body;

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    console.log("Parameters received:", { hotelID, adults, checkInDate, checkOutDate });

    let response = {};
    try {

        response = await amadeus.shopping.hotelOffersSearch.get({
            hotelIds: hotelID,
            adults: adults,
            checkInDate: checkInDate.substring(0, 10),
            checkOutDate: checkOutDate.substring(0, 10)
        });

        const data = JSON.parse(response.body).data;

        if (data.length === 0) {
            return res.status(404).json({ message: "No rooms available for the selected dates" });
        }
        const roomData = data[0].offers;

        let rooms = []
        for (let i = 0; i < roomData.length; i++) {
            const room = {
                hotel: data[0].hotel.name,
                type: roomData[i].room.typeEstimated.category,
                beds: roomData[i].room.typeEstimated.beds,
                bedType: roomData[i].room.typeEstimated.bedType,
                description: roomData[i].room.description,
                price: roomData[i].price.total
            }

            rooms.push(room);
        }

        return res.status(200).json(rooms);

    } catch (error) {
        // Log the full error for debugging
        console.log(error);

        try {
            const codeError = error.response.result.errors[0].code;
            if (codeError == 3664) return res.status(404).json({ message: "No rooms available for the selected dates" });

        } catch (error) {
            console.log("EREROR");
            return res.status(404).json({ message: "This Hotel is currently unavailable." });
        }


    }
};

export const bookRoom = async (req, res) => {
    const { price, numOfDays, hotel, currency, room, checkIn, checkOut, name, promocode } = req.body;
    console.log("Parameters received:", req.body);
    const touristID = req.params.id;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    let conversionRate = 0;
    console.log("Parameters received:", { price, numOfDays, hotel, currency, room });

    try {
        conversionRate = await getConversionRate(currency);
        //fetch tourist
        const tourist = await Tourist.findById(touristID);

        if (!tourist) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        //convert price to USD using exchange rate api
        const priceConverted = parseInt(price * conversionRate);

        //create product on stripe
        const productStripe = await stripe.products.create({
            name: `Booking in${hotel.hotel}`,
            description: `We wish you a quacking stay in ${hotel.hotel}`,
            default_price_data: {
                currency: "usd",
                unit_amount: priceConverted * 100,
            },
        });

        //fetch promocode if it exists
        let promo;
        if (promocode) {
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

        //create checkout session 
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        unit_amount: priceConverted * 100,
                        product_data: {
                            name: `Booking in${hotel.hotel}`,
                            description: `We wish you a quacking stay in ${hotel.hotel}`,
                        }
                    },
                    quantity: parseInt(numOfDays),
                },
            ],
            mode: 'payment',
            discounts: promo ? [{ promotion_code: promo.stripeID }] : [],
            success_url: 'http://localhost:5173/touristDashboard/booked', //todo:add correct link
            cancel_url: 'https://www.amazon.com/',  //todo:add correct link
            metadata: {
                tourist_id: touristID,
                hotel: hotel.hotel,
                price: price,
                type: hotel.type,
                description: hotel.description.text,
                type: "hotel",
                bedType: hotel.bedType,
                beds: hotel.beds,
                checkIn: checkIn,
                checkOut: checkOut,
                name: name
            }
        });


        return res.status(200).json({ url: session.url });


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error booking Hotel", error: error.message });
    }
}