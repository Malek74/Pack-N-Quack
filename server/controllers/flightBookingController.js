import Amadeus from 'amadeus';
import Tourist from '../models/touristSchema.js';
import Stripe from 'stripe';

//@route GET /api/bookFlight
//@desc Search cheapest flight from A to B in a given date
export const searchFlight = async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate } = req.body;
  //validate that all fields are present
  if (!originLocationCode || !destinationLocationCode || !departureDate || !adults) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  //const to hold date in amadeus format
  const date = (new Date(departureDate).toISOString().substring(0, 10)).toString();

  const searchData = {
    originLocationCode,
    destinationLocationCode,
    departureDate: date,
    adults: 1
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
    console.log(error);
    return res.status(404).json("No Flights Found");
  }
}

//@route POST /api/bookFlight/
//@desc Confirm flight price
export const confirmFlightPrice = async (req, res) => {
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

    const flightData = (JSON.parse(response.body).data.flightOffers[0]);
    // return res.status(200).send(flightData);

    const journeyData = {
      itineraries: flightData.itineraries,
      basePrice: flightData.travelerPricings[0].price.base,
      taxes: flightData.travelerPricings[0].price.refundableTaxes,
      total: flightData.travelerPricings[0].price.total,
    }

    return res.status(200).send(journeyData);



  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

export const bookFlight = async (req, res) => {
  const { price, numTickets } = req.body;
  const touristID = req.params.id;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    //fetch tourist
    const tourist = await Tourist.findById(touristID);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    //create stripe price object
    const priceObject = await stripe.prices.create({
      currency: "usd",
      unit_amount: price * 100,
      product_data: {
        name: "Flight Booking",
      },
    });




  } catch (error) {

  }
}