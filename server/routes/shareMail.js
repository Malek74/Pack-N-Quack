import nodemailer from 'nodemailer';
import express from 'express';
import axios from 'axios';


const router = express.Router();

// Create a transporter object
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // e.g., smtp.gmail.com for Gmail
    port: 465, // Or 587 for other providers
    secure: true, // true for 465, false for 587
    auth: {
        user: 'captianquackerss@gmail.com', // organization's email
        pass: 'jihj uzqf uheo gdfk', // your email password
    },
});



const sendMail = async (req, res) => {

    const { friendEmail, senderName, activityLink } = req.body;

    const mailOptions = {
        from: '"CaptainQuackers" <captainquackers@your-domain.com>',
        to: friendEmail, // friendEmail
        subject: `${senderName} recommends an activity for you!`,
        text: `Hey there, your friend ${senderName} recommends this activity: ${activityLink}`,
        html: `<b>Hey there,</b><p>Your friend ${senderName} recommends this activity:</p><a href="${activityLink}">${activityLink}</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

router.post('/:id', sendMail);
export default router;

