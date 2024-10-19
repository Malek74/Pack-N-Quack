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

    const searchData = req.body.data;

    console.log(searchData);

    const amadeus = new Amadeus({
        clientId: process.env.AMADEUS_API_KEY,
        clientSecret: process.env.AMADEUS_API_SECRET
    });

    try {

        const response = await amadeus.shopping.flightOffers.pricing.post(
            {
                data: {
                    type: "flight-offers-pricing",
                    flightOffers: [searchData],
                }
            },
            { include: "credit-card-fees,detailed-fare-rules" }
        );
        res.json(response.data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const bookFlight = async (req, res) => {


  try {
    // Book a flight from MAD to ATH on 2022-08-01
    const flightOffersResponse = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: "MAD",
      destinationLocationCode: "ATH",
      departureDate: "2022-08-01",
      adults: "1",
    });

    const pricingResponse = await amadeus.shopping.flightOffers.pricing.post({
      data: {
        type: "flight-offers-pricing",
        flightOffers: [flightOffersResponse.data[0]],
      },
    });

    const response = await amadeus.booking.flightOrders.post({
      data: {
        type: "flight-order",
        flightOffers: [pricingResponse.data.flightOffers[0]],
        travelers: [
          {
            id: "1",
            dateOfBirth: "1982-01-16",
            name: {
              firstName: "JORGE",
              lastName: "GONZALES",
            },
            gender: "MALE",
            contact: {
              emailAddress: "jorge.gonzales833@telefonica.es",
              phones: [
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "34",
                  number: "480080076",
                },
              ],
            },
            documents: [
              {
                documentType: "PASSPORT",
                birthPlace: "Madrid",
                issuanceLocation: "Madrid",
                issuanceDate: "2015-04-14",
                number: "00000000",
                expiryDate: "2025-04-14",
                issuanceCountry: "ES",
                validityCountry: "ES",
                nationality: "ES",
                holder: true,
              },
            ],
          },
        ],
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

