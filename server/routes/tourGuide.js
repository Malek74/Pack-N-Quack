import express from "express";
import multer from 'multer';
import { createTourGuide, getTourGuides, editTourGuide, deleteTourGuide,getTourGuideById, rateTourGuide, acceptTerms, getRevenue} from "../controllers/tourguideController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();
// const multer = require('multer');
//const upload = multer ({dest: 'documents-upload/'});

// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });

router.get("/allTourGuides", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);
router.get('/:id', getTourGuideById);
router.delete('/:id', deleteTourGuide);
router.post('/rate/:id', rateTourGuide);
router.put('/terms/:id', acceptTerms);
router.get("/testing/:id", getRevenue);
router.put("/", protect, editTourGuide);
router.get('/', protect, getTourGuideById);
router.delete('/', protect, deleteTourGuide);
router.post('/rate/:id', protect, rateTourGuide);
router.put('/terms/', protect, acceptTerms);
router.get("/testing", getRevenue);

export default router;