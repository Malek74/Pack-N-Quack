import express from "express";
import { protect } from '../middleware/authenticator.js';
import { addAdvertiser, getAdvertisers, getAdvertiser, deleteAdvertiser, updateAdvertiser, getAdvertiserActivities, acceptTerms, getBookingCount } from "../controllers/advertisersController.js";

const router = express.Router();

router.post("/", addAdvertiser);

router.get("/allAdvertisers", getAdvertisers);

router.get("/", protect, getAdvertiser);

router.delete("/", protect, deleteAdvertiser);

router.put("/update", protect, updateAdvertiser);

router.get("/activities", protect, getAdvertiserActivities);

router.put("/terms", protect, acceptTerms);
router.put("/terms/:id", acceptTerms);

router.get("/testing/:id",getBookingCount);

export default router;