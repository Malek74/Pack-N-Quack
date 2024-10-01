import express from "express";
import { createToursitGovernor } from "../controllers/touristGovernorController.js";

const router = express.Router();

router.post("/", createToursitGovernor);

export default router;