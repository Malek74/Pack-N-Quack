import express from "express";
import { addItinerary, deleteItinerary, getMaxPrice, getItinerary, updateItinerary, getMyItineraries, getItineraryById, addActivity, getAllLanguages } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);
router.get("/viewItinerary/:id", getItineraryById);
router.get("/maxPrice", getMaxPrice);
router.get("/languages", getAllLanguages);
router.post("/addActivity/:id", addActivity);
export default router;

