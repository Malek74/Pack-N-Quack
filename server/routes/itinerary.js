import express from "express";
import { addItinerary, deleteItinerary, getItinerary, viewAllItineraries } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/:id", getItinerary);
router.get("/", viewAllItineraries);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
export default router;

