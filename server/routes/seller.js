import express from "express";
import { getAllSellers, createSeller, getSellerByID, updateSellerInfo, deleteSeller, acceptTerms } from "../controllers/sellerController.js";
import { protect } from '../middleware/authenticator.js';

const router = express.Router();

router.get("/allSellers", getAllSellers);
router.post("/", createSeller);
router.put("/", protect, updateSellerInfo);
router.get('/', protect, getSellerByID);
router.delete('/', protect, deleteSeller);
router.put('/terms/', protect, acceptTerms);

export default router;