import express from "express";
import { listHotels } from "../controllers/hotelBooking.js";

const router = express.Router();

router.get("/", listHotels);

export default router;