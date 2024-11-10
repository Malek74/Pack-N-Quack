import express from 'express';
import { bookTransportation, createTransportation, getTransportation, getTransportationById } from '../controllers/transportationController.js';

const router = express.Router();

router.post("/:id", createTransportation);
router.get("/", getTransportation);
router.get("/:id", getTransportationById);
router.post("/book/:id", bookTransportation);
export default router;