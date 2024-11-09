import express from 'express';
import { createTransportation, getTransportation, getTransportationById } from '../controllers/transportationController.js';

const router = express.Router();

router.post("/:id", createTransportation);
router.get("/", getTransportation);
router.get("/:id", getTransportationById);

export default router;