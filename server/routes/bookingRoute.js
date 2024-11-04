import express from "express";
import {flaggedEvents,requestDeleteAccount} from "../controllers/bookingController.js";

const router = express.Router();

router.put("/flagg", flaggedEvents);
router.delete("/delete", requestDeleteAccount);


export default router;