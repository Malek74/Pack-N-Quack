import express from "express";
import { getActivities, addActivity, updateActivity, deleteActivity } from "../controllers/activityController.js";

const router = express.Router();

// Get all activities
router.get("/", getActivities);

// Add an activity
router.post("/", addActivity);

// Edit an activity
router.put("/update/:id", updateActivity);

// Delete an activity
router.delete("/delete/:id", deleteActivity);

export default router;