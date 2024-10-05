import express from "express";

import { getTouristGovernor, createTouristGovernor, updateTouristGovernor, deleteTouristGovernor } from "../controllers/touristGovernorController.js";

const router = express.Router();

router.post("/", createTouristGovernor);
router.get("/", getTouristGovernor);
router.put("/", updateTouristGovernor);
router.delete("/", deleteTouristGovernor);


export default router;