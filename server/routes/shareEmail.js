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

router.post('/:id', shareMail);
export default router;

