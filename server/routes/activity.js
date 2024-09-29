import express from "express";
import { getActivities, addActivity } from "../controllers/activityController.js";

const router = express.Router();

// Get all activities
router.get("/", getActivities);

// Add an activity
router.post("/", addActivity);

export default router;