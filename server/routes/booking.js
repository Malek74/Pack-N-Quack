import express from "express";
import { bookEvent, cancelBooking, flaggedEvents, requestDeleteAccount } from "../controllers/bookingController.js";

const router = express.Router();

router.post('/bookEvent/:id', bookEvent);
router.post("/cancelBooking/:id", cancelBooking);
router.put("/flagg", flaggedEvents);
router.post("/delete", requestDeleteAccount);

export default router;

