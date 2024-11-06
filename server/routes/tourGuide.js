import express from "express";
import { createTourGuide, getTourGuides, editTourGuide,getTourGuideById, rateTourGuide, acceptTerms} from "../controllers/tourguideController.js";

const router = express.Router();

router.get("/", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);
router.get('/:id', getTourGuideById);
router.post('/rate/:id', rateTourGuide);
router.put('/terms/:id', acceptTerms);

export default router;