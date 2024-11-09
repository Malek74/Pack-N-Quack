import express from "express";
import  upload  from '../middleware/multer.js';
import cloudinary from "../utils/cloudinary.js";
import { addItinerary, deleteItinerary, getMaxPrice, getItinerary, updateItinerary, getMyItineraries, getItineraryById, addActivity, getAllLanguages, Flagg, rateIternary, addImagesToItinerary, addCoverImageToItinerary, addImagesToActivity } from "../controllers/itineraryController.js";

const router = express.Router();

router.post("/", upload.fields([{ name: 'images', maxCount: 20 }, { name: 'coverImage', maxCount: 1 },{name: "activityImages", maxcount: 10}]), addItinerary);
router.get("/", getItinerary);
router.delete("/:id", deleteItinerary);
router.put("/:id", updateItinerary);
router.get("/myItineraries/:id", getMyItineraries);
router.get("/viewItinerary/:id", getItineraryById);
router.get("/maxPrice", getMaxPrice);
router.get("/languages", getAllLanguages);
router.put("/updateActivityImage/:id", upload.fields([{ name: 'images', maxCount: 1 }]), addImagesToActivity);
router.put("/updateCoverImage/:id", upload.fields([{ name: 'images', maxCount: 1 }]), addCoverImageToItinerary);
router.put("/updateItineraryImages/:id", upload.fields([{ name: 'images', maxCount: 10 }]) , addImagesToItinerary);
router.put("/flag/:id", Flagg);
//router.put('/:id', ItineraryActivation);
router.post("/addActivity/:id", addActivity);
router.post("/rate/:id", rateIternary);
export default router;

