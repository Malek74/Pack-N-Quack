import express from "express";

import { getTouristGovernor, createTouristGovernor, updateTouristGovernor, deleteTouristGovernor } from "../controllers/touristGovernorController.js";
import { getTourGuideById } from "../controllers/tourguideController.js";

const router = express.Router();

router.post("/", createTouristGovernor);
router.get("/", getTouristGovernor);
router.get("/:id", getTourGuideById);
router.put("/", updateTouristGovernor);
router.delete("/", deleteTouristGovernor);


export default router;