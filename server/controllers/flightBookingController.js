import { getAmadeusToken } from '../utils/Helpers.js';
import Amadeus from "amadeus";

//@route GET /api/bookFlight
//@desc Search cheapest flight from A to B in a given date
export const searchFlight = async (req, res) => {
    const { originLocationCode, destinationLocationCode, departureDate, adults } = req.body;

    //validate that all fields are present
    if (!originLocationCode || !destinationLocationCode || !departureDate) {
        return res.status(400).json({ message: "Please add all fields" });
    }


    const searchData = {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults
    }

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    try {
        const response = await amadeus.shopping.flightOffersSearch.get(searchData);

        const data = (JSON.parse(response.body).data);
        res.status(200).send(data);
    } catch (error) {
        console.error(error);
    }
}

//@route POST /api/bookFlight
//@desc Confirm flight price
export const confirmFlightPrice = async (req, res) => {
    const { originLocationCode, destinationLocationCode, departureDate, adults } = req.body;

    //validate that all fields are present
    if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
        return res.status(400).json({ message: "Please add all fields" });
    }

    const searchData = {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults,
    }

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    try {
        const flightOffersResponse = await amadeus.shopping.flightOffersSearch.get({
            searchData
        });

        console.log(flightOffersResponse);
        const response = await amadeus.shopping.flightOffers.pricing.post(
            {
                data: {
                    type: "flight-offers-pricing",
                    flightOffers: [flightOffersResponse.data[0]],
                },
            },
            { include: "credit-card-fees,detailed-fare-rules" }
        );
        res.json(response.data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}