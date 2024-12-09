import express from "express";
import { listHotelRooms, listHotels, bookRoom } from "../controllers/hotelBooking.js";
import { protect } from "../middleware/authenticator.js";

const router = express.Router();

router.post("/", listHotels);
router.post("/rooms", listHotelRooms)
router.post("/bookRoom", protect, bookRoom);

export default router;


