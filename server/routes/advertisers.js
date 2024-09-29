import express from "express";
import { addAdvertiser, getAdvertisers } from "../controllers/advertisersController.js";

const router = express.Router();

router.post("/", addAdvertiser);
router.get("/", getAdvertisers);
export default router;