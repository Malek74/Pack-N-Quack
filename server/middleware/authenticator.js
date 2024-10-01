import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import admin from '../models/AdminSchema.js';
import advertiser from '../models/AdvertiserSchema.js';

config();

export const protect = async (req, res, next) => {
    let token;

    // Check if the token is provided in the Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract the token from the header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decoded)
            // Attach the user to the request object
            const user = await admin.find({ _id: decoded._id }).select('-password') || await advertiser.find({ _id: decoded._id }).select('-password'); // Exclude the password
            req.user = user;
            next(); // Call the next middleware or route handler
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

