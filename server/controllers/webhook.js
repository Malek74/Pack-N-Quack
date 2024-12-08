import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import { addLoyaltyPoints } from "../utils/Helpers.js";
import AmadeusBooking from "../models/amadeusBooking.js";
import Booking from "../models/bookingSchema.js";
import Transportation from "../models/transportationSchema.js";

export const confirmPayment = async (req, res) => {
    const event = req.body;
    let eventBooked = {}
    console.log(event);

    switch (event.type) {
        case 'checkout.session.completed':

            //fetch relevant data
            const session = event.data.object;
            const eventID = session.metadata.eventID;
            const eventType = session.metadata.eventType;
            const touristID = session.metadata.touristID;
            let bookedEvent = {}
            bookedEvent.touristID = touristID;
            bookedEvent.stripeSessionID = session.id;
            bookedEvent.status = "confirmed";
            const type = session.metadata.type;
            console.log("Metadata: ", session.metadata);
            try {
                if (type === "event") {
                    //fetch event booked
                    if (eventType == "activity") {
                        eventBooked = await activityModel.findById(eventID);
                        bookedEvent.price = session.metadata.price;
                        bookedEvent.activityID = eventBooked._id;
                        bookedEvent.date = eventBooked.date;
                        console.log("Activity Booked: ", eventBooked);

                    }
                    else if (eventType == "itinerary") {
                        eventBooked = await Itinerary.findById(eventID);
                        bookedEvent.itineraryID = eventBooked._id;
                        bookedEvent.price = eventBooked.price;
                        bookedEvent.date = session.metadata.date;
                    }
                    bookedEvent.stripeSessionID = session.id;
                    bookedEvent.numOfTickets = session.metadata.numOfTickets;

                    console.log("Event Booked: ", eventBooked);

                    //add loyalty points
                    addLoyaltyPoints(touristID, session.amount_total / 100);

                    //save booking entry to database
                    const saveBooking = await Booking.create(bookedEvent);
                    console.log("Saved Booking: ");
                    console.log(saveBooking);
                    return res.status(200).json(saveBooking);
                }
                else if (type === "flight") {
                    //save flight booking to database
                    const touristId = session.metadata.tourist_id;
                    console.log(touristId);

                    const flightBooking = await AmadeusBooking.create({
                        flightData: {
                            flight: session.metadata.flight,
                            price: session.metadata.price,
                            departure: session.metadata.departure,
                            arrival: session.metadata.arrival,
                            date: session.metadata.date
                        },
                        touristID: touristId,
                        stripeSessionID: session.id
                    });
                    console.log(flightBooking);
                    return res.status(200).json(flightBooking);
                }
                else if (type === "hotel") {
                    console.log("Hotel MetData: ", session.metadata);
                    //save flight booking to database
                    const touristId = session.metadata.tourist_id;

                    const hotelBooking = await AmadeusBooking.create({
                        hotelData: {
                            hotel: session.metadata.name,
                            price: session.metadata.price,
                            type: session.metadata.type,
                            bedType: session.metadata.bedType,
                            description: session.metadata.description,
                            price: session.metadata.price,
                            beds: session.metadata.beds,
                            checkIn: session.metadata.checkIn,
                            checkOut: session.metadata.checkOut
                        },
                        touristID: touristId,
                        stripeSessionID: session.id
                    });
                    console.log(hotelBooking);
                    return res.status(200).json(hotelBooking);
                }
                else if (type === "transportation") {
                    //save transportation booking to database
                    const touristId = session.metadata.touristID;
                    const eventID = session.metadata.eventID;
                    const price = session.metadata.price;
                    const transport = await Transportation.findById(eventID);
                    console.log(transport._id);
                    const transportationBooking = {
                        touristID: touristId,
                        stripeSessionID: session.id,
                        transportationID: transport._id,
                        price: price,
                        status: "confirmed",
                        date: transport.date

                    };
                    transportationBooking.stripeSessionID = session.id;
                    transportationBooking.numOfTickets = session.metadata.numOfTickets;
                    const saveBooking = await Booking.create(transportationBooking);
                    console.log("Saved Booking: ");
                    console.log(saveBooking);
                }
            }
            catch (error) {
                console.log(error);
                return res.status(404).json({ message: error.message });
            }
            //todo:send an email to the tourist



            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('Webhook received');
};
