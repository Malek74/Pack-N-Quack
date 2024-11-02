import express from "express";
import { confirmFlightPrice, searchFlight } from "../controllers/flightBookingController.js";

const router = express.Router();

router.get("/", searchFlight);
router.post("/", confirmFlightPrice);
// router.post("/book/:id", bookFlight);

export default router;