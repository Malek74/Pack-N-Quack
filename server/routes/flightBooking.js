import express from "express";
import { confirmFlightPrice, searchFlight, bookFlight } from "../controllers/flightBookingController.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post("/", searchFlight);
router.post("/flightPrice", confirmFlightPrice);
router.post("/book", protect, bookFlight);

export default router;