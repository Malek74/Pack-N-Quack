import express from 'express';
import {
    createTourist,
    getTourist,
    updateTourist,
    getTourists,
    deleteTourist,
    getMyprefernces,
    getMyBookings,
    redeemPoints,
    getMyFlights,
    getMyHotels,
    viewMyTourGuides,
    viewMyItineraries,
    viewMyActivities,
    addItemToCart,
    removeItemFromCart,
    updateQuantityInCart,
    getCart
} from '../controllers/touristController.js';
import { createComplaint, viewMyComplaints, viewComplaintById } from '../controllers/complaintController.js';



const router = express.Router();

router.post('/', createTourist); // Create
router.get('/:id', getTourist); // Read 
router.put('/:id', updateTourist); // Update 
router.get('/', getTourists)
router.delete('/:id', deleteTourist);
router.get('/myPreferences/:id', getMyprefernces);
router.post('/myBookings/:id', getMyBookings);
router.post('/redeemPoints/:id', redeemPoints);
router.get('/myFlights/:id', getMyFlights);
router.get('/myHotels/:id', getMyHotels);
router.get('/mytourguides/:id', viewMyTourGuides);
router.get('/myitineraries/:id', viewMyItineraries);
router.get('/myactivities/:id', viewMyActivities);
router.get('/complaints/:id', viewMyComplaints);
router.post('/complaints', createComplaint);
router.get('/myComplaints/:id', viewComplaintById);
router.post('/addItemToCart', addItemToCart);
router.delete('/cart/removeItemFromCart', removeItemFromCart);
router.put('/cart/updateQuantity', updateQuantityInCart);
router.get('/cart/viewCart', getCart);
export default router;