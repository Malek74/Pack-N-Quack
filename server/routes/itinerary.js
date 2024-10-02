import express from "express";
import { addItinerary, deleteItinerary, getItinerary, viewAllItineraries, updateItinerary, getMyItineraries, upcomingIternaries } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);
router.get("/upcoming", upcomingIternaries);

export default router;

