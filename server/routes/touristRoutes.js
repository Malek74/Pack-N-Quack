import express from 'express';
import {
    createTourist,
    getTourist,
    updateTourist,
    getTourists,
    deleteTourist,
    getMyprefernces,
    getMyBookings,
    redeemPoints
} from '../controllers/touristController.js';
import { createComplaint, viewMyComplaints } from '../controllers/complaintController.js';


const router = express.Router();

router.post('/', createTourist); // Create
router.get('/:id', getTourist); // Read 
router.put('/:id', updateTourist); // Update 
router.get('/', getTourists)
router.delete('/:id', deleteTourist);
router.get('/myPreferences/:id', getMyprefernces);
router.get('/myBookings/:id', getMyBookings);
router.post('/redeemPoints/:id', redeemPoints);
router.get('/complaints/:id', viewMyComplaints);
router.post('/complaints', createComplaint);

export default router;