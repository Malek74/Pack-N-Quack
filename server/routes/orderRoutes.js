import express from "express";
import { rateProduct , ReviewProduct,viewAllOrderDetails,viewSingleOrderDetails,viewPendingOrderDetails,cancelOrder} from "../controllers/orderController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.put('/rate', protect , rateProduct);
router.put('/review', protect , ReviewProduct);
router.get('/viewAll', protect ,viewAllOrderDetails);
router.get('/viewOne', protect ,viewSingleOrderDetails);
router.get('/viewPending', protect ,viewPendingOrderDetails);
router.put('/cancel', protect , cancelOrder);



export default router;