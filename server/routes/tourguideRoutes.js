import express from 'express';
import { 
    createTourGuide,

} from '../controllers/tourguideController.js'


const router = express.Router();

router.post('/TourGuide', createTourGuide); // Create



export default router;