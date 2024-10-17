import express from "express";
import { confirmFlightPrice, searchFlight } from "../controllers/flightBookingController.js";

const router = express.Router();

router.get("/", searchFlight);
router.post("/", confirmFlightPrice);

export default router;