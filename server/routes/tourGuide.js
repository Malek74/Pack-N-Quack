import express from "express";
import multer from 'multer';
import { createTourGuide, getTourGuides, editTourGuide,getTourGuideById } from "../controllers/tourguideController.js";

const router = express.Router();
// const multer = require('multer');
//const upload = multer ({dest: 'documents-upload/'});

// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });

router.get("/", getTourGuides);
router.post("/", createTourGuide);
router.put("/:id", editTourGuide);
router.get('/:id', getTourGuideById);
// router.post('/:id/documents-upload', upload.array('documents', 2), TourGuideUploadDocuments);


export default router;