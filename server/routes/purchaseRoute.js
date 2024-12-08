import express from "express";
import {buyItem , rateProduct , ReviewProduct,viewPurchasedItems,cancelOrder} from "../controllers/purchaseController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.post('/buy', protect , buyItem);
router.put('/rate', protect , rateProduct);
router.put('/review', protect , ReviewProduct);
router.get('/view', protect ,viewPurchasedItems);
router.put('/cancel', protect , cancelOrder);



export default router;