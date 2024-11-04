import Amadeus from 'amadeus';
import Tourist from '../models/touristSchema.js';
import Stripe from 'stripe';
import { convertPrice } from '../utils/Helpers.js';

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

//@route GET /api/bookFlight
//@desc Search cheapest flight from A to B in a given date
export const searchFlight = async (req, res) => {
  const { originLocationCode, destinationLocationCode, departureDate } = req.body;
  //validate that all fields are present
  if (!originLocationCode || !destinationLocationCode || !departureDate) {
    return res.status(400).json({ message: "Please add all fields" });
  }
  //const to hold date in amadeus format
  const date = (new Date(departureDate).toISOString().substring(0, 10)).toString();

  const originCode = cities.find(city => city.city === originLocationCode);
  const destinationCode = cities.find(city => city.city === destinationLocationCode);
  console.log(originCode, destinationCode, date);
  const searchData = {
    originLocationCode: originCode.iata_code,
    destinationLocationCode: destinationCode.iata_code,
    departureDate: date,
    adults: 1
  }
  console.log(searchData);

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
  const { price, numTickets, origin, destination, prefCurrency } = req.body;
  const touristID = req.params.id;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    //fetch tourist
    const tourist = await Tourist.findById(touristID);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    //convert price to USD using exchange rate api
    const price = convertPrice(price, prefCurrency);

    //create product on stripe
    const productStripe = await stripe.products.create({
      name: `${origin} to ${destination}`,
      description: 'Have a quacking flight to ${destination}',
      default_price_data: {
        currency: "usd",
        unit_amount: price * 100,
      },
    });

    //create checkout session 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: productStripe.default_price_id,
          quantity: numTickets,
        },
      ],
      mode: 'payment',
      success_url: 'https://www.google.com/', //todo:add correct link
      cancel_url: 'https://www.amazon.com/',  //todo:add correct link
      metadata: {
        tourist_id: touristID,
        flightData: {
          flight: `${origin} to ${destination}`,
          price: price,
          departure: origin,
          arrival: destination
        }
        
      }
    });



  } catch (error) {

  }
}