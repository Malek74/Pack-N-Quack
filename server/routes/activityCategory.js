import express from "express";
import { getActivityCateogries, addActivityCategory, getActivityCateogry, updateActivityCategory, deleteActivityCategory } from "../controllers/activityCategoryController.js";

const router = express.Router();

// Get all activity categories
router.get("/", getActivityCateogries);

// get a single activity category
router.get("/:id", getActivityCateogry);

// Add an activity category
router.post("/", addActivityCategory);

// Edit an activity category
router.put("/update/:id", updateActivityCategory);

// Delete an activity category
router.delete("/delete/:id", deleteActivityCategory);

export default router;
