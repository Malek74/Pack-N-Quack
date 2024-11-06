import express from "express";
import { addItinerary, deleteItinerary, getMaxPrice, getItinerary, updateItinerary, getMyItineraries, getItineraryById,getAllLanguages, rateIternary} from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);
router.get("/viewItinerary/:id", getItineraryById);
router.get("/maxPrice", getMaxPrice);
router.get("/languages", getAllLanguages);
router.post("/rate/:id", rateIternary); 
export default router;

