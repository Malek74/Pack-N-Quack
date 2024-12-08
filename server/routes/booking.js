import express from "express";
import { bookEvent, cancelBooking, flaggedEvents, requestDeleteAccount, test } from "../controllers/bookingController.js";

const router = express.Router();

router.post('/bookEvent/:id', bookEvent);
router.post("/cancelBooking/:id", cancelBooking);
router.put("/flagg", flaggedEvents);
router.post("/delete", requestDeleteAccount);
router.get("/test",test);

export default router;

