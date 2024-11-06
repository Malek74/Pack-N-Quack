import express from "express";
import { confirmFlightPrice, searchFlight, bookFlight } from "../controllers/flightBookingController.js";

const router = express.Router();

router.post("/", searchFlight);
router.post("/flightPrice", confirmFlightPrice);
router.post("/book/:id", bookFlight);

export default router;