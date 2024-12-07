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
    bookmark,
    viewBookmarks,
    AddNewAddress,
    setDefaultAddress,
    viewAddresses,
    getMyWalletBalance,
    getMyPromoCodes
} from '../controllers/touristController.js';
import { createComplaint, viewMyComplaints, viewComplaintById } from '../controllers/complaintController.js';
import { protect } from '../middleware/authenticator.js';
import { getMyTransactions } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createTourist); // Create
router.get('/', /*protect,*/ getTourist); // Read 
router.put('/', protect, updateTourist); // Update 
router.get('/allTourists', getTourists)
router.delete('/', protect, deleteTourist);
router.get('/myPreferences', protect, getMyprefernces);
router.post('/myBookings', protect, getMyBookings);
router.post('/redeemPoints', protect, redeemPoints);
router.get('/myFlights', protect, getMyFlights);
router.get('/myHotels', protect, getMyHotels);
router.get('/mytourguides', protect, viewMyTourGuides);
router.get('/myitineraries', protect, viewMyItineraries);
router.get('/myactivities', protect, viewMyActivities);
router.get('/complaints/', protect, viewMyComplaints);
router.post('/complaints', protect, createComplaint);
router.get('/myComplaints', protect, viewComplaintById);
router.get("/myTransactions", protect, getMyTransactions);
router.post('/save', bookmark);
router.get('/viewbookmark', viewBookmarks);
router.post('/addAddress', AddNewAddress);
router.post('/setdefault', setDefaultAddress);
router.get('/viewAddress', viewAddresses);
router.get('/walletBalance', /*protect,*/ getMyWalletBalance);
router.get('/myPromoCodes', /*protect,*/ getMyPromoCodes);




export default router;