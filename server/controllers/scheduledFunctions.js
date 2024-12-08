import { getUsersTodayBirthdays } from "../utils/Helpers.js"
import nodeMailer from "nodemailer";
import notificationSchema from "../models/notificationSchema.js";
import { getMyBookings } from "./touristController.js";
import Booking from "../models/bookingSchema.js";
import activityModel from "../models/activitySchema.js";
import Itinerary from "../models/itinerarySchema.js";
import Tourist from "../models/touristSchema.js";

/**
 * Sends birthday promo codes to users who have a birthday today
 *
 * @return {Promise<void>}
 */

const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'captianquackerss@gmail.com', // Your email
        pass: process.env.EMAIL_PASSKEY,  // Your email app password
    },
});



export const sendBirthdayPromoCode = async () => {
    //fetch all users whose birthday is today
    const users = await getUsersTodayBirthdays();

    //send promo code to each user
    users.forEach(async (user) => {
        const { email, username, promoCode } = user;
        await sendBirthdayEmail(email, username, promoCode.code);
    });

    console.log('Birthday promo codes sent successfully!');


};

const sendBirthdayEmail = async (email, username, promoCode) => {
    console.log(email, username, promoCode);
    try {
        const mailOptions = {
            from: '"CaptainQuackers" <captainquackers@gmail.com>',
            to: email,
            subject: `Happy Birthday, ${username}! 🥳`,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #ff6600;">Happy Birthday, ${username}! 🎉</h1>
                <p>We hope your day is filled with joy, laughter, and a lot of quacking fun!</p>
                <p>As a special gift from all of us at Pack N Quack, here’s your unique birthday code:</p>
                <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 18px; font-weight: bold;">
                    ${promoCode}
                </div>
                <p>You can use this code to enjoy exclusive discounts anywhere on our website. But hurry, it’s only valid for 7 days!</p>
                <p>Thank you for being part of our flock. We’re so glad to celebrate this special day with you.</p>
                <p>Quacking Best Wishes,<br>The Pack N Quack Team 🦆</p>
                <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px; height:auto; margin-top: 10px;" />
            </div>
            `,
            attachments: [
                {
                    filename: 'logo.png',
                    path: '../client/public/assets/icons/logo.png', // Adjust path to your logo
                    cid: 'logo',
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        console.log('Birthday email sent successfully!');
    } catch (error) {
        console.error('Error sending birthday email:', error.message);
    }
};

export const sendEventReminderEmail = async (userEmail, userName, eventName, eventDate) => {
    const mailOptions = {
        from: '"CaptainQuackers" <captainquackers@gmail.com>',
        to: userEmail, // Recipient address
        subject: `Reminder: Upcoming Event - ${eventName}`, // Email Subject
        html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h1 style="color: #0D47A1;">Upcoming Event Reminder</h1>
                    <p>Hello ${userName},</p>
                    <p>We hope you’re excited! This is a friendly reminder about the event you booked on Pack N Quack:</p>
                    <div style="background-color: #F4F4F4; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="margin: 0; color: #0D47A1;">${eventName}</h2>
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>\
                    </div>
                    <p>Make sure to arrive on time to enjoy the full experience. If you have any questions or need assistance, feel free to reach out to our support team.</p>
                    <p>We look forward to seeing you there!</p>
                    <p>Best regards,<br>The Pack N Quack Team</p>
                    <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px; height:auto; margin-top: 20px;" />
                </div>
            `,
        attachments: [
            {
                filename: 'logo.png',
                path: '../client/public/assets/icons/logo.png', // Path to your logo
                cid: 'logo', // Attach inline logo
            },
        ],
    };

    try {
        await transporter.sendMail(mailOptions); // Send email using transporter
        console.log(`Reminder email sent successfully to ${userEmail}`);
    } catch (error) {
        console.error('Error sending reminder email:', error.message);
    }
};

export const upcomingEvent = async () => {
    const events = await Booking.find({}).populate('activityID itineraryID');

    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        const { touristID, activityID, itineraryID, } = event;
        let bookingEvent;
        if (activityID) {
            bookingEvent = await activityModel.findById(activityID);
        }
        if (itineraryID) {
            bookingEvent = await Itinerary.findById(itineraryID);
        }

        //check that the event is within 7 days
        const eventDate = new Date(event.date);
        const today = new Date();

        if (Math.ceil(eventDate.getTime() - today.getTime() / (1000 * 60 * 60 * 24))) {
            const notification = await notificationSchema.create({
                title: 'Upcoming Event Reminder',
                user: { id: touristID, role: 'Tourist' },
                message: `You have an upcoming event: ${bookingEvent.name}`,
                type: 'reminder',
                read: false,
            });


            const tourist = await Tourist.findById(touristID);

            if (tourist) {
                //send reminder email

                // const email = tourist.email;
                // const username = tourist.username;
                // const name = bookingEvent.name;
                const date = bookingEvent.date;
                const eventDate = new Date(date).toDateString();

                await sendEventReminderEmail(tourist.email, tourist.username, bookingEvent.name, eventDate);
            }
        }

    }
}


