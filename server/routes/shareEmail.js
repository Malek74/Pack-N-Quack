import nodemailer from 'nodemailer';
import express from 'express';
import axios from 'axios';
import tourist from '../models/touristSchema.js';
import Itinerary from '../models/itinerarySchema.js';


const router = express.Router();

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // Or 587 for other providers
    secure: true, // true for 465, false for 587
    auth: {
        user: 'captianquackerss@gmail.com', // organization's email
        pass: process.env.EMAIL_PASSKEY, // your email password
    },
});



const shareMail = async (req, res) => {
    const { friendEmail, itineraryID } = req.body;
    try {
        const sender = await tourist.findById(req.params.id);
        const itinerary = await Itinerary.findById(itineraryID);

        if (!sender || !itinerary) {
            return res.status(404).send('Sender or itinerary not found');
        }

        const senderName = sender.name;

        const mailOptions = {
            from: '"CaptainQuackers" <captainquackers@gmail.com>',
            to: friendEmail,
            subject: `${senderName} recommends a quacking good activity for you!`,
            text: `Hey there, your friend ${senderName} discovered an exciting activity that you'll love: ${itinerary.name}`,
            html: `
            <div>
                
                <h1>Hey there,</h1>
                <p>Your friend ${senderName} discovered an exciting activity that you'll love:</p>
                <h3><a href="${itinerary._id}">${itinerary.name}</a></h3>
                <p>This is a wonderful opportunity for you to dive into some fun and make a splash together! ${senderName} knows you’ll have a flaptastic time exploring and creating unforgettable memories.</p>
                <p>By creating your own Pack N Quack account, you'll find even more egg-citing adventures and join ${senderName} on this journey!</p>
                <p>Don’t let this opportunity float away! Check it out and let ${senderName} know what you think. You’re going to quack up on this adventure!</p>
                  <img src="cid:logo" alt="Pack N Quack Logo" style="width:150px;height:auto;" />
                <p>Best,<br>Captain Quackers</p>


            </div>
        `,
            attachments: [
                {
                    filename: 'logo.png', // The name of the file
                    path: '../client/public/assets/icons/logo.png', // Path to the logo image
                    cid: 'logo', // This is the Content-ID
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');

    } catch (error) {
        res.status(500).send(error.message);
    }
};



export const sendEventBookingNotification = async (userEmail, userName, eventName, eventDate, eventLocation, bookingLink) => {

    try {

        // Email content
        const mailOptions = {
            from: '"CaptainQuackers" <captainquackers@gmail.com>',
            to: userEmail,
            subject: `${eventName} is Now Open for Booking!`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h1 style="text-align: center; color: #444;">📢 ${eventName} is Now Open for Booking!</h1>
          <p>Hello ${userName},</p>
          <p>We’re thrilled to announce that the event you’ve been waiting for, <strong>${eventName}</strong>, is now open for booking! 🎉</p>
          <div style="margin-bottom: 20px;">
              <p><strong>Date:</strong> ${eventDate}</p>
              <p><strong>Location:</strong> ${eventLocation}</p>
          </div>
          <p>Seats are limited, so don’t wait too long to secure your spot.</p>
          <p style="text-align: center;">
              <a href="${bookingLink}" style="text-decoration: none; background-color: #007BFF; color: #ffffff; padding: 10px 20px; border-radius: 5px; font-size: 16px;">Book Now</a>
          </p>
          <p>We look forward to seeing you there!</p>
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #777;">
              <p>Need assistance? Contact us at support@yourorganization.com or call us at (123) 456-7890.</p>
              <p>Thank you,<br>Your Organization</p>
          </div>
        </div>
        `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Event booking notification sent successfully:');
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}



// Example usage
sendEventBookingNotification(
    'user@example.com',  // User's email
    'John Doe',          // User's name
    'Amazing Event',     // Event name
    'December 15, 2024', // Event date
    'Downtown Hall',     // Event location
    'https://example.com/book-event' // Booking link
);
router.post('/:id', shareMail);
export default router;

