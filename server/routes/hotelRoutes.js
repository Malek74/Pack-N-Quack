import express from "express";
import { listHotelRooms, listHotels } from "../controllers/hotelBooking.js";

const router = express.Router();

router.post("/", listHotels);
router.post("/rooms", listHotelRooms)

export default router;