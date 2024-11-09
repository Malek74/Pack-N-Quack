import Amadeus from 'amadeus';
import Tourist from '../models/touristSchema.js';
import Stripe from 'stripe';
import { convertPrice, getConversionRate } from '../utils/Helpers.js';
import AmadeusBooking from '../models/amadeusBooking.js';

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
  const searchData = (req.body.flight);

  const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_API_KEY,
    clientSecret: process.env.AMADEUS_API_SECRET
  });
  try {
    const conversionRate = await getConversionRate(req.query.currency);
    const response = await amadeus.shopping.flightOffers.pricing.post(
      {
        data: {
          type: "flight-offers-pricing",
          flightOffers: [
            {
              type: "flight-offer",
              id: "1",
              source: "GDS",
              instantTicketingRequired: false,
              nonHomogeneous: false,
              oneWay: false,
              isUpsellOffer: false,
              lastTicketingDate: "2024-11-06",
              lastTicketingDateTime: "2024-11-06",
              numberOfBookableSeats: 9,
              itineraries: [
                {
                  duration: "PT15H20M",
                  segments: [
                    {
                      departure: {
                        iataCode: "JFK",
                        terminal: "1",
                        at: "2024-11-06T20:00:00",
                      },
                      arrival: {
                        iataCode: "CMN",
                        terminal: "2",
                        at: "2024-11-07T08:55:00",
                      },
                      carrierCode: "AT",
                      number: "201",
                      aircraft: {
                        code: "789",
                      },
                      operating: {
                        carrierCode: "AT",
                      },
                      duration: "PT6H55M",
                      id: "51",
                      numberOfStops: 0,
                      blacklistedInEU: false,
                    },
                    {
                      departure: {
                        iataCode: "CMN",
                        terminal: "1",
                        at: "2024-11-07T12:00:00",
                      },
                      arrival: {
                        iataCode: "CAI",
                        terminal: "2",
                        at: "2024-11-07T18:20:00",
                      },
                      carrierCode: "AT",
                      number: "270",
                      aircraft: {
                        code: "73H",
                      },
                      operating: {
                        carrierCode: "AT",
                      },
                      duration: "PT5H20M",
                      id: "52",
                      numberOfStops: 0,
                      blacklistedInEU: false,
                    },
                  ],
                },
              ],
              price: {
                currency: "EUR",
                total: "421.61",
                base: "148.00",
                fees: [
                  {
                    amount: "0.00",
                    type: "SUPPLIER",
                  },
                  {
                    amount: "0.00",
                    type: "TICKETING",
                  },
                ],
                grandTotal: "421.61",
              },
              pricingOptions: {
                fareType: ["PUBLISHED"],
                includedCheckedBagsOnly: true,
              },
              validatingAirlineCodes: ["AT"],
              travelerPricings: [
                {
                  travelerId: "1",
                  fareOption: "STANDARD",
                  travelerType: "ADULT",
                  price: {
                    currency: "EUR",
                    total: "421.61",
                    base: "148.00",
                  },
                  fareDetailsBySegment: [
                    {
                      segmentId: "51",
                      cabin: "ECONOMY",
                      fareBasis: "OL0WAAMA",
                      class: "O",
                      includedCheckedBags: {
                        quantity: 2,
                      },
                    },
                    {
                      segmentId: "52",
                      cabin: "ECONOMY",
                      fareBasis: "OL0WAAMA",
                      class: "O",
                      includedCheckedBags: {
                        quantity: 2,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }
      },
      { include: "credit-card-fees,detailed-fare-rules" }
    );
    conso
    const flightData = (JSON.parse(response.body).data.flightOffers[0]);
    console.log(journeyData);

    const journeyData = {
      itineraries: flightData.itineraries,
      basePrice: flightData.travelerPricings[0].price.base,
      taxes: flightData.travelerPricings[0].price.refundableTaxes * conversionRate,
      total: flightData.travelerPricings[0].price.total * conversionRate,
    }

    console.log(journeyData);

    return res.status(200).send(journeyData);

  } catch (error) {
    res.status(500).json(error);
  }

}

export const bookFlight = async (req, res) => {
  const { price, numTickets, origin, destination, currency } = req.body;
  const touristID = req.params.id;
  const conversionRate = await getConversionRate(currency);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const originCity = cities.find(city => city.iata_code === origin).city;
  const destinationCity = cities.find(city => city.iata_code === destination).city;

  console.log(price, numTickets, originCity, destinationCity);

  try {
    //fetch tourist
    const tourist = await Tourist.findById(touristID);

    if (!tourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }

    //convert price to USD using exchange rate api
    const priceConverted = parseInt(price * conversionRate);


    //create product on stripe
    const productStripe = await stripe.products.create({
      name: `${originCity} to ${destinationCity}`,
      description: 'Have a quacking flight to ${destination}',
      default_price_data: {
        currency: "usd",
        unit_amount: priceConverted * 100,
      },
    });

    console.log(productStripe);

    //create checkout session 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: priceConverted * 100,
            product_data: {
              name: `${originCity} to ${destinationCity}`,
              description: `Have a quacking flight to ${destinationCity}`,
            }
          },
          quantity: parseInt(numTickets.numTickets),
        },
      ],
      mode: 'payment',
      success_url: 'https://www.google.com/', //todo:add correct link
      cancel_url: 'https://www.amazon.com/',  //todo:add correct link
      metadata: {
        tourist_id: touristID,
        flight: `${origin} to ${destination}`,
        price: price,
        departure: origin,
        arrival: destination,
        type: "flight"
      }
    });
    console.log(session);

    return res.status(200).json({ url: session.url });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error booking flight", error: error.message });
  }
}

export const getMyFlights = async (req, res) => {
  const touristID = req.params.id;
  try {
    const flights = await AmadeusBooking.find({ touristID: touristID });
    return res.status(200).json(flights);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
}