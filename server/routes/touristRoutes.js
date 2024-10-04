import express from 'express';
import { 
    createTourist,
    getTourist,
    updateTourist
} from '../controllers/touristController.js';


const router = express.Router();

router.post('/tourist', createTourist); // Create
router.get('/tourist/:email', getTourist); // Read 
router.put('/tourist/:username', updateTourist); // Update 


export default router;