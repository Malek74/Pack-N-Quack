import express from "express";
import { addItinerary, deleteItinerary, getItinerary, updateItinerary, getMyItineraries } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);

export default router;

