import express from "express";
import { addAdvertiser, getAdvertisers, getAdvertiser, deleteAdvertiser, updateAdvertiser, getAdvertiserActivities, acceptTerms } from "../controllers/advertisersController.js";
import { protect } from '../middleware/authenticator.js';
const router = express.Router();

router.post("/", protect, addAdvertiser);

router.get("/allAdvertisers", getAdvertisers);

router.get("/", protect, getAdvertiser);

router.delete("/", protect, deleteAdvertiser);

router.put("/update", protect, updateAdvertiser);

router.get("/activities", protect, getAdvertiserActivities);

router.put("/terms", protect, acceptTerms);

export default router;