import express from "express";
import { bookEvent, cancelBooking } from "../controllers/bookingController.js";

const router = express.Router();

router.post('bookEvent/:id', bookEvent);
router.post("/cancelBooking/:id", cancelBooking);
export default router;