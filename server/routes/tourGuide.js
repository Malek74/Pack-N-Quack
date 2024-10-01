import express from "express";
import { createTourGuide, getTourGuides, editTourGuide } from "../controllers/tourguideController.js";

const router = express.Router();

router.get("/", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);

export default router;