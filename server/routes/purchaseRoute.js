import express from "express";
import {buyItem , rateProduct , ReviewProduct} from "../controllers/purchaseController.js";

const router = express.Router();

router.post('/buy',buyItem);
router.put('/rate', rateProduct);
router.put('/review', ReviewProduct);


export default router;