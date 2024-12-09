import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import { addLoyaltyPoints } from "../utils/Helpers.js";
import AmadeusBooking from "../models/amadeusBooking.js";
import Booking from "../models/bookingSchema.js";
import Transportation from "../models/transportationSchema.js";
import nodemailer from 'nodemailer';
import Tourist from "../models/touristSchema.js";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Use 587 if `secure` is false
    secure: true, // true for 465, false for 587
    auth: {
        user: 'captianquackerss@gmail.com', // Organization's email
        pass: process.env.EMAIL_PASSKEY,   // Email password
    },
});

export const sendPaymentReceipt = async (email, username, itineraryName, paymentDate, totalAmount, transactionId) => {
    const mailOptions = {
        from: '"CaptainQuackers" <captianquackerss@gmail.com>',
        to: email,
        subject: `Payment Receipt for ${itineraryName}`,
        text: `
        Hello ${username},

        Thank you for your payment for booking "${itineraryName}" on ${paymentDate}.
        Below are your payment details:

        - Itinerary/Event Name: ${itineraryName}
        - Payment Date: ${paymentDate}
        - Total Amount: $${totalAmount.toFixed(2)}
        - Transaction ID: ${transactionId}

        If you have any questions or need assistance, please feel free to contact us.

        Best regards,
        Captain Quackers and the Pack N Quack Team
        `,
        html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #0D47A1;">Payment Receipt</h1>
            <p>Hi <strong>${username}</strong>,</p>
            <p>Thank you for your payment for <strong>${itineraryName}</strong>. Below are the details of your transaction:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Payment Description</th>
                    <td style="padding: 8px; border: 1px solid #ddd;">${itineraryName}</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Payment Date</th>
                    <td style="padding: 8px; border: 1px solid #ddd;">${paymentDate}</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Total Amount</th>
                    <td style="padding: 8px; border: 1px solid #ddd;">$${totalAmount.toFixed(2)}</td>
                </tr>
                <tr>
                    <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">Transaction ID</th>
                    <td style="padding: 8px; border: 1px solid #ddd;">${transactionId}</td>
                </tr>
            </table>
            <p>If you have any questions or need further assistance, please feel free to <a href="mailto:captianquackerss@gmail.com">contact us</a>.</p>
            <p>Best regards,<br>Captain Quackers and the Pack N Quack Team</p>
            <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px;height:auto; margin-top: 20px;" />
        </div>
        `,
        attachments: [
            {
                filename: 'logo.png',
                path: '../client/public/assets/icons/logo.png',
                cid: 'logo',
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment receipt email sent to ${email}`);
    } catch (error) {
        console.error('Error sending payment receipt email:', error.message);
        throw new Error('Failed to send payment receipt email.');
    }
};


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
                        const tourist = await Tourist.findById(touristID);
                        await sendPaymentReceipt(tourist.email, tourist.username, eventBooked.name, eventBooked.date, session.amount_total / 100, session.id);

                    }
                    else if (eventType == "itinerary") {
                        eventBooked = await Itinerary.findById(eventID);
                        bookedEvent.itineraryID = eventBooked._id;
                        bookedEvent.price = eventBooked.price;
                        bookedEvent.date = session.metadata.date;
                        const tourist = await Tourist.findById(touristID);
                        await sendPaymentReceipt(tourist.email, tourist.username, eventBooked.name, eventBooked.date, session.amount_total / 100, session.id);
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

                    //send email to tourist
                    const tourist = await Tourist.findById(touristId);
                    await sendPaymentReceipt(tourist.email, tourist.username, `booking a room in ${hotel.hotel}`, hotel.checkIn, session.amount_total / 100, session.id);

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



            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send('Webhook received');
};
