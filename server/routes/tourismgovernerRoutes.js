import express from 'express';
import { 
    createTouristGovernor,

} from '../controllers/touristGovernorController.js';


const router = express.Router();

router.post('/TouristGovernor', createTouristGovernor); // Create



export default router;