import express from "express";
import { addAdvertiser, getAdvertisers, getAdvertiser, deleteAdvertiser, updateAdvertiser, getAdvertiserActivities } from "../controllers/advertisersController.js";

const router = express.Router();

router.post("/", addAdvertiser);

router.get("/", getAdvertisers);

router.get("/:id", getAdvertiser);

router.delete("/delete/:id", deleteAdvertiser);

router.put("/update/:id", updateAdvertiser);

router.get("/activities/:id", getAdvertiserActivities);

export default router;