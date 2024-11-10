import express from "express";
import { requestPasswordChange } from "../controllers/passChangeController.js";

const router = express.Router();

router.post("/:id", requestPasswordChange);

export default router;
