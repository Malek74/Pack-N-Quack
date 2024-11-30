import express from "express";
import { bookEvent, cancelBooking, flaggedEvents, requestDeleteAccount,viewUpcomingBooking,viewPastBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post('/bookEvent/:id', bookEvent);
router.post("/cancelBooking/:id", cancelBooking);
router.put("/flagg", flaggedEvents);
router.post("/delete", requestDeleteAccount);
router.get("/viewUp/:id", viewUpcomingBooking);
router.get("/viewPast/:id", viewPastBooking);



export default router;

