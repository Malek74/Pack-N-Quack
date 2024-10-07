import express from "express";
import { addItinerary, deleteItinerary, getItinerary, updateItinerary, getMyItineraries, getItineraryById } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);
router.get("/viewItinerary/:id", getItineraryById);
export default router;

