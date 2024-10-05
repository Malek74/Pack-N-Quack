import express from 'express';
import {
    createTourist,
    getTourist,
    updateTourist,
    getTourists
} from '../controllers/touristController.js';


const router = express.Router();

router.post('/', createTourist); // Create
router.get('/:username', getTourist); // Read 
router.put('/:username', updateTourist); // Update 
router.get('/', getTourists)

export default router;