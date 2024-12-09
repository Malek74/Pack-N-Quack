import express from "express";

import { getTouristGovernor, createTouristGovernor,getAllTouristGovernor, updateTouristGovernor, deleteTouristGovernor } from "../controllers/touristGovernorController.js";
import { getTourGuideById } from "../controllers/tourguideController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.post("/", createTouristGovernor);
router.get("/", protect, getTouristGovernor);
router.get("/allTouristGovernors", getAllTouristGovernor);
router.get("/:id",  getTourGuideById);
router.put("/", protect, updateTouristGovernor);
router.delete("/", protect, deleteTouristGovernor);


export default router;