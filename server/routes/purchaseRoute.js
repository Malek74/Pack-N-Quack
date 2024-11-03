import express from "express";
import {buyItem} from "../controllers/purchaseController.js";

const router = express.Router();

router.post('/buy',buyItem);

export default router;