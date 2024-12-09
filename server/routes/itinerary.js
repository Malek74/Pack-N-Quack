import express from "express";
import { upload } from '../middleware/multer.js';
import { addItinerary, deleteItinerary, getMaxPrice, getItinerary, updateItinerary, getMyItineraries, getItineraryById, getAllLanguages, Flagg, rateIternary, toggleItineraryActive, getAdminItineraries } from "../controllers/itineraryController.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post("/", protect, upload.fields([{ name: 'images', maxCount: 20 }, { name: 'coverImage', maxCount: 1 }, { name: "activityImages", maxcount: 10 }]), addItinerary);
router.get("/", getItinerary);
router.get("/admin", getAdminItineraries);
router.delete("/:id", deleteItinerary);
router.put("/:id", upload.fields([{ name: 'images', maxCount: 20 }, { name: 'coverImage', maxCount: 1 }, { name: "activityImages", maxcount: 10 }]), updateItinerary);
router.get("/myItineraries",protect, getMyItineraries);
router.get("/viewItinerary/:id", getItineraryById);
router.get("/maxPrice", getMaxPrice);
router.get("/languages", getAllLanguages);
router.put("/flag/:id", Flagg);
router.put('/toggleActive/:id', toggleItineraryActive);
router.post("/rate/:id", protect, rateIternary);
export default router;

