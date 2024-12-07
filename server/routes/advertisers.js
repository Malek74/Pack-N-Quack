import express from "express";
import { addAdvertiser, getAdvertisers, getAdvertiser, deleteAdvertiser, updateAdvertiser, getAdvertiserActivities, acceptTerms, getBookingCount } from "../controllers/advertisersController.js";

const router = express.Router();

router.post("/", addAdvertiser);

router.get("/", getAdvertisers);

router.get("/:id", getAdvertiser);

router.delete("/:id", deleteAdvertiser);

router.put("/update/:id", updateAdvertiser);

router.get("/activities/:id", getAdvertiserActivities);

router.put("/terms/:id", acceptTerms);

router.get("/testing/:id",getBookingCount);

export default router;