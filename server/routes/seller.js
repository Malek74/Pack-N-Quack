import express from "express";
import {getAllSellers,createSeller,getSellerByID,updateSellerInfo,deleteSeller, acceptTerms} from "../controllers/sellerController.js";

const router = express.Router();

router.get("/", getAllSellers);
router.post("/", createSeller);
router.put("/:id", updateSellerInfo);
router.get('/:id', getSellerByID);
router.delete('/:id', deleteSeller);
router.put('/terms/:id', acceptTerms);

export default router;