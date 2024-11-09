import express from "express";
import { listHotelRooms, listHotels, bookRoom } from "../controllers/hotelBooking.js";

const router = express.Router();

router.post("/", listHotels);
router.post("/rooms", listHotelRooms)
router.post("/bookRoom/:id", bookRoom);

export default router;


