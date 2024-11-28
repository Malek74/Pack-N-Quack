import express from "express";
import { bookEvent, cancelBooking, flaggedEvents, requestDeleteAccount } from "../controllers/bookingController.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post('/bookEvent/', protect, bookEvent);
router.post("/cancelBooking/", protect, cancelBooking);
router.put("/flagg", flaggedEvents);
router.post("/delete", protect, requestDeleteAccount);


export default router;

