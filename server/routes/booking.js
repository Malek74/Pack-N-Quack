import express from "express";
import { bookEvent, cancelBooking, flaggedEvents, requestDeleteAccount,viewUpcomingBooking,viewPastBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post('/bookEvent/', /*protect,*/ bookEvent);
router.post("/cancelBooking/", protect, cancelBooking);
router.put("/flagg", flaggedEvents);
router.post("/delete", protect, requestDeleteAccount);

router.get("/viewUp",protect, viewUpcomingBooking);
router.get("/viewPast",protect, viewPastBooking);



export default router;

