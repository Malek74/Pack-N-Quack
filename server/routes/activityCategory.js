import express from "express";
import { getActivityCateogries, addActivityCategory, getActivityCateogry, updateActivityCategory, deleteActivityCategory } from "../controllers/activityCategoryController.js";

const router = express.Router();

// Get all activity categories
router.get("/", getActivityCateogries);

// get a single activity category
router.get("/:nane", getActivityCateogry);

// Add an activity category
router.post("/", addActivityCategory);

// Edit an activity category
router.put("/update/:name", updateActivityCategory);

// Delete an activity category
router.delete("/delete/:name", deleteActivityCategory);

export default router;
