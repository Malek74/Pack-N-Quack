import express from "express";
import multer from 'multer';
import { createTourGuide, getTourGuides, editTourGuide, deleteTourGuide,getTourGuideById, rateTourGuide, acceptTerms, getRevenue} from "../controllers/tourguideController.js";

const router = express.Router();
// const multer = require('multer');
//const upload = multer ({dest: 'documents-upload/'});

// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });

router.get("/", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);
router.get('/:id', getTourGuideById);
router.delete('/:id', deleteTourGuide);
router.post('/rate/:id', rateTourGuide);
router.put('/terms/:id', acceptTerms);
router.get("/testing/:id", getRevenue);

export default router;