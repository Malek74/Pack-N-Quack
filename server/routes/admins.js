import express from "express";
import { getAdmins } from "../controllers/adminsController.js";

const router = express.Router();

router.get("/", getAdmins);

export default router;