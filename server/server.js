// Import necessary modules
import mongoose from 'mongoose';
import admins from './routes/admins.js';
import seller from './routes/seller.js';
import products from './routes/products.js';
import itinerary from './routes/itinerary.js';
import tourGuide from './routes/tourGuide.js';
import express from 'express';
import tagRoutes from './routes/tagRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import touristRoutes from './routes/touristRoutes.js';
import multer from 'multer';
import { isTourismGovernor } from './middleware/auth.js';
import touristGoverner from './routes/touristGovernor.js';
import itineraryTag from './routes/itineraryTag.js';
import advertisers from './routes/advertisers.js';
import activity from './routes/activity.js';
import activityCategory from './routes/activityCategory.js';
import activityTag from './routes/activityTag.js';
import complaint from './routes/complaint.js';
import logger from './middleware/logger.js';
import { config } from 'dotenv';
import cors from 'cors';
import PasswordChangeRequest from './routes/changePass.js';
import uploadRoutes from './routes/fileRoutes.js';
import purchaseRoute from './routes/purchaseRoute.js';
import orderRoutes from "./routes/orderRoutes.js"
import shareMail from './routes/shareEmail.js';
import flightBooking from './routes/flightBooking.js';
import currency from './routes/currency.js';
import booking from './routes/booking.js';
import webhook from './routes/webhook.js';
import hotelRoutes from './routes/hotelRoutes.js';
import transportation from './routes/transportationRoutes.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import e from 'express';
import SocketConnection from './models/socketConnections.js';
import cookieParser from 'cookie-parser';
import { login, logout, forgotPassword, updatePassword } from './controllers/loginRegisterController.js';
import { protect } from './middleware/authenticator.js';
import cron from "node-cron";
import { sendBirthdayPromoCode, upcomingEvent, updateOrderStatus } from "./controllers/scheduledFunctions.js";
import notificationSchema from './models/notificationSchema.js';

import notifications from './routes/notification.js';

config();
const app = express();
const port = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;
const httpServer = createServer(app); // Create an HTTP server & attach the Express app to it
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    }
});


export { io };

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});;

// Middleware to parse JSON
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: false }));

// Middleware to enable CORS
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend domain.com', // Replace with your frontend domain
    credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions));

app.use(logger);
// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


//upon connection, join the user's room as he sends the 
io.on('connection', async (socket) => {
    console.log('A user connected and his socket id is: ' + socket.handshake.auth.userId);


    const roomID = socket.handshake.auth.userId.toString();
    socket.join(roomID);
    console.log('User joined room: ' + socket.handshake.auth.userId);
    const notification = await notificationSchema.find({ 'user.id': roomID });

    //send the user his notifications
    io.to(roomID).emit('initialNotifications', notification);
});


// Define Endpoints
app.use('/api/places', placeRoutes);
app.use('/api/tourist', touristRoutes);
app.use('/api/sellers', seller);
app.use('/api/products', products);
app.use('/api/itinerary', itinerary);
app.use('/api/tourGuide', tourGuide);
app.use('/api/touristGovernor', touristGoverner);
app.use('/api/itiernaryTags', itineraryTag);
app.use('/api/advertisers', advertisers);
app.use('/api/activity', activity);
app.use('/api/activity/category', activityCategory);
app.use('/api/activity/tag', activityTag);
app.use('/api/changepass', PasswordChangeRequest);
app.use('/api/share/', shareMail);
app.use('/api/bookFlight', flightBooking);
app.use('/api/currencies', currency);
app.use('/api/booking', booking);
app.use('/webhook', webhook);
app.use('/api/hotels', hotelRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/transaction', purchaseRoute);
app.use('/api/order', orderRoutes);
app.use('/api/complaints', complaint);
app.use('/api/admins', admins);
app.use('/api/transportation', transportation);
app.use('/api/itiernaryTags', tagRoutes);
app.post('/api/login', login);
app.get('/api/logout', logout);
app.use('/api/notifications', notifications);
app.post('/api/forgotPassword', forgotPassword);
app.post('/api/OTPPassword', protect, updatePassword);

// Schedule the function to run at 11 PM every day
cron.schedule("40 12 * * *", () => {
    console.log("Running task at 11:05 PM...");
    sendBirthdayPromoCode(); // Call your birthday promo code function
});


//schedule the function to run 2:59
cron.schedule("50 12 * * *", () => {
    console.log("Running task at 11:05 PM...");
    upcomingEvent();
});

//schedule the function to run every 20 minutes
cron.schedule("*/20 * * * *", () => {
    console.log("Running task every 20 minutes...");
    updateOrderStatus();
});
