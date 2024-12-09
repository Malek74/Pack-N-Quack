import express from "express";
import { getActivities, addActivity, updateActivity, deleteActivity, searchActivity, getUpcomingActivities, postReview, filterAndSortActivities, getMyActivities, viewSingleActivity, Flagg, notifyMe } from "../controllers/activityController.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

// Get all activities
router.get("/", getActivities);

// Add an activity
router.post("/", protect, addActivity);

// Edit an activity
router.put("/update/:id", updateActivity);

// Delete an activity
router.delete("/delete/:id", deleteActivity);

// Search for an activity based on Name ,Category or Tag
router.get("/search", searchActivity);

// Get upcoming activities
router.get("/upcoming", getUpcomingActivities);

// Post a review
router.post("/review/:id", protect, postReview);

// Get filtered activities
router.post("/filterSort", filterAndSortActivities);

// Get My activities
router.get("/my/", protect, getMyActivities);

router.put("/flag/:id", Flagg);
router.get("/activityDetails/:id", viewSingleActivity);
router.post("/notifyMe/:id",/*protect,*/ notifyMe); //todo: add protect
export default router;