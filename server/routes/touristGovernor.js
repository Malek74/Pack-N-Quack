import express from "express";

import { getTouristGovernor, createTouristGovernor, updateTouristGovernor, deleteTouristGovernor } from "../controllers/touristGovernorController.js";
import { getTourGuideById } from "../controllers/tourguideController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.post("/", createTouristGovernor);
router.get("/allTouristGovernors", protect, getTouristGovernor);
router.get("/", protect, getTourGuideById);
router.put("/", protect, updateTouristGovernor);
router.delete("/", protect, deleteTouristGovernor);


export default router;