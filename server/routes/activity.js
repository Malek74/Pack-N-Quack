import express from "express";
import { getActivities, addActivity, updateActivity, deleteActivity, searchActivity, getUpcomingActivities, postReview, filterAndSortActivities, getMyActivities, viewSingleActivity,Flagg } from "../controllers/activityController.js";

const router = express.Router();

// Get all activities
router.get("/", getActivities);

// Add an activity
router.post("/", addActivity);

// Edit an activity
router.put("/update/:id", updateActivity);

// Delete an activity
router.delete("/delete/:id", deleteActivity);

// Search for an activity based on Name ,Category or Tag
router.get("/search", searchActivity);

// Get upcoming activities
router.get("/upcoming", getUpcomingActivities);

// Post a review
router.post("/review/:id", postReview);

// Get filtered activities
router.get("/filterSort", filterAndSortActivities);

// Get My activities
router.get("/my/:id", getMyActivities);

router.put("/:id", Flagg);
router.get("/activityDetails/:id", viewSingleActivity);
export default router;