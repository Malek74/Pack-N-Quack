import express from "express";
import { getActivityTags, addActivityTags, getActivityTag, updateActivityTag, deleteActivityTag } from "../controllers/activityTagController.js";

const router = express.Router();

// Get all activity tags
router.get("/", getActivityTags);

// Add an activity tag
router.post("/", addActivityTags);

// Get a single activity tag
router.get("/:id", getActivityTag);

// Edit an activity tag
router.put("/update/:id", updateActivityTag);

// Delete an activity tag
router.delete("/delete/:id", deleteActivityTag);

export default router;