import express from "express";
import multer from 'multer';
import { createTourGuide, getTourGuides, editTourGuide, deleteTourGuide, getTourGuideById, rateTourGuide, acceptTerms } from "../controllers/tourguideController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();
// const multer = require('multer');
//const upload = multer ({dest: 'documents-upload/'});

// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });

router.get("/allTourGuides", getTourGuides);
router.post("/", createTourGuide);
router.put("/", protect, editTourGuide);
router.get('/', protect, getTourGuideById);
router.delete('/', protect, deleteTourGuide);
router.post('/rate/:id', protect, rateTourGuide);
router.put('/terms/', protect, acceptTerms);

export default router;