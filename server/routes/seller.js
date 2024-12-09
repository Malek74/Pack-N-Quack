import express from "express";
import { protect } from '../middleware/authenticator.js';
import {getAllSellers,createSeller,getSellerByID,updateSellerInfo,deleteSeller, acceptTerms, getRevenue, getProducts} from "../controllers/sellerController.js";

const router = express.Router();

router.get("/allSellers", getAllSellers);
router.post("/", createSeller);
router.put("/", protect, updateSellerInfo);
router.get('/', protect, getSellerByID);
router.delete('/', protect, deleteSeller);
router.put('/terms/', protect, acceptTerms);
router.put("/:id", updateSellerInfo);
router.get('/:id', getSellerByID);
router.delete('/:id', deleteSeller);
router.put('/terms/:id', acceptTerms);
router.get("/revenue/reports", protect,getRevenue);
router.get("/my/products", protect, getProducts);

export default router;