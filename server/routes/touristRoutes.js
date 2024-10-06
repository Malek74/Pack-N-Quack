import express from 'express';
import {
    createTourist,
    getTourist,
    updateTourist,
    getTourists,
    deleteTourist
} from '../controllers/touristController.js';


const router = express.Router();

router.post('/', createTourist); // Create
router.get('/:username', getTourist); // Read 
router.put('/:username', updateTourist); // Update 
router.get('/', getTourists)
router.delete('/:username', deleteTourist);

export default router;