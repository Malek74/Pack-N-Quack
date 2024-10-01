import express from 'express';
import { 
    createPlace, 
    readPlace, 
    updatePlace, 
    deletePlace,
    listAllPlaces 
} from '../controllers/placeController.js'; // Adjust the path as necessary
import { isTourismGovernor } from '../middleware/authMiddleware.js'; // Middleware to check if the user is a tourism governor

const router = express.Router();

// CRUD Routes for Places
router.post('/places', isTourismGovernor, createPlace); // Create Place
router.get('/places/:placeId', isTourismGovernor, readPlace); // Read Place
router.put('/places/:placeId', isTourismGovernor, updatePlace); // Update Place
router.delete('/places/:placeId', isTourismGovernor, deletePlace); // Delete Place
router.get('/places', listAllPlaces);

export default router;
