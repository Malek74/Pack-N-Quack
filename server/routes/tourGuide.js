import express from "express";
import { createTourGuide, getTourGuides, editTourGuide,getTourGuideById } from "../controllers/tourguideController.js";

const router = express.Router();

router.get("/", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);
router.get('/:id', getTourGuideById);

export default router;