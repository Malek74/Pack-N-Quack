import express from "express";

import { getTouristGovernor, createTouristGovernor } from "../controllers/touristGovernorController.js";

const router = express.Router();

router.post("/", createTouristGovernor);
router.get("/", getTouristGovernor);

export default router;