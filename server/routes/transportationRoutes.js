import express from 'express';
import { bookTransportation, createTransportation, getTransportation, getTransportationById } from '../controllers/transportationController.js';
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.post("/", protect, createTransportation);
router.get("/", getTransportation);
router.get("/:id", getTransportationById);
router.post("/book",protect, bookTransportation);
export default router;