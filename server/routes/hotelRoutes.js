import express from "express";
import { listHotelRooms, listHotels } from "../controllers/hotelBooking.js";

const router = express.Router();

router.get("/", listHotels);
router.get("/rooms", listHotelRooms)

export default router;