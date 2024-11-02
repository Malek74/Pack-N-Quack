import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import { addLoyaltyPoints } from "../utils/Helpers.js";


export const confirmPayment = async (req, res) => {
    const event = req.body;
    let eventBooked = {}

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

            try {
                //fetch event booked
                if (eventType == "activity") {
                    eventBooked = await activityModel.findById(eventID);
                    bookedEvent.activityID = eventBooked._id;
                }
                else if (eventType == "itinerary") {
                    eventBooked = await Itinerary.findById(eventID);
                    bookedEvent.itineraryID = eventBooked._id;
                }

                //add loyalty points
                addLoyaltyPoints(touristID, session.amount_total / 100);

                //save booking entry to database
                const saveBooking = await Booking.create(bookedEvent);

                return res.status(200).json(saveBooking);

            }
            catch (error) {
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
