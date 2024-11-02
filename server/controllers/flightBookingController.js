import Amadeus from 'amadeus';
import tourist from '../models/touristSchema.js';
import Stripe from 'stripe';
import axios from 'axios';

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
    return res.status(404).json({ message: error.message });
  }
}

//@route POST /api/bookFlight/
//@desc Confirm flight price
export const confirmFlightPrice = async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate, adults } = req.body;

  const searchData = req.body.data;


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

    //fetch flight ticket info
    let priceInUsd = 0;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const ticketsNum = req.body.data.flightOffers[0].travelerPricings.length;
    const ticketsPrice = req.body.data.flightOffers[0].travelerPricings[0].price.total;
    const currency = req.body.data.flightOffers[0].travelerPricings[0].price.currency;
    await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXHANGE_RATE_API_KEY}/pair/${currency}/USD/${ticketsPrice}`).then((response) => {

      priceInUsd = response.data.conversion_result;
    });

    priceInUsd *= ticketsNum;

  

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

/*
export const bookFlight = async (req, res) => {

  const { data, numOfTickets } = req.body;

  res.json(data);

  try {
    const traveller = await tourist.findById(req.params.id);
    let travelers = [];

    for (let i = 0; i < numOfTickets; i++) {
      const firstName = traveller.name.split(' ')[0];
      const lastName = traveller.name.split(' ')[1];
      const traveler = {
        id: data.flightOffers[0].travelerPricings[i].travelerId,  // Match with travelerPricings IDs
        dateOfBirth: traveller.dob.toISOString().substring(0, 10),
        name: {
          firstName: firstName,
          lastName: lastName
        },
        gender: traveller.gender.toUpperCase(),
        contact: {
          emailAddress: traveller.email,
          phones: [{
            deviceType: "MOBILE",
            countryCode: "20",
            number: traveller.mobile.substring(1)
          }]
        },
        documents: [{
          documentType: 'PASSPORT',
          birthPlace: 'Egypt',
          issuanceLocation: 'Egypt',
          issuanceDate: '2015-04-14',
          number: '00000000',
          expiryDate: '2025-04-14',
          issuanceCountry: 'EG',
          validityCountry: 'EG',
          nationality: 'EG',
          holder: true
        }]
      }
      travelers.push(traveler);
    }
    if (!traveller) {
      return res.status(404).json({ message: "Traveller not found" });
    }


    const amadeus = new Amadeus({
      clientId: process.env.AMADEUS_API_KEY,
      clientSecret: process.env.AMADEUS_API_SECRET
    });


    const response = await amadeus.booking.flightOrders.post({
      data: {
        type: "flight-order",
        flightOffers: [data.flightOffers[0]],
        travelers: travelers,

      },
    });
    return res.json(response);
  } catch (error) {
    console.error(error);
  }
}
*/
